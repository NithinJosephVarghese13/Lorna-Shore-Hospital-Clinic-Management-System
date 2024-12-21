const express = require('express');
const { selectByFields } = require('../controllers/controller');
const { nextId } = require('../models/common_models');
const { BookAppointment, Appointment, Patient } = require('../models/hospital_models');
const router = express.Router();

// Select all booking requests - GET
router.get('/', async (req, res) => {
    try {
        const bookings = await BookAppointment.find()
            .populate('patient', 'name dob')
            .populate('doctor', 'name specialization visitingHours contact');
        const formattedBookings = bookings.map(booking => ({
            ...booking.toObject(),
            date: booking.appointmentDate ? new Date(booking.appointmentDate).toISOString().split('T')[0] : 'Not specified',
            time: booking.appointmentTime || 'Not specified'
        }));

        res.status(200).json(formattedBookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings.' });
    }
});


// Select booking request by ID - GET
router.get('/:id', async (req, res) => {
    try {
        const booking = await BookAppointment.findById(req.params.id)
            .populate('patient', 'name dob')
            .populate('doctor', 'name specialization visitingHours');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Error fetching booking.' });
    }
});

// Add this new route to bookappointment_router.js
// In bookappointment_router.js
router.get('/patients', async (req, res) => {
    try {
        console.log('Fetching approved bookings...');
        
        // Get approved bookings
        const bookings = await BookAppointment.find({ requestStatus: 'approved' })
            .populate({
                path: 'patient',
                select: 'name dob contact userinfo'
            });

        console.log('Found bookings>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>:', bookings);

        if (!bookings || bookings.length === 0) {
            return res.status(200).json([]); // Return empty array if no bookings
        }
        // Extract unique patients
        const patientMap = new Map();
        bookings.forEach(booking => {
            if (booking.patient && !patientMap.has(booking.patient._id)) {
                patientMap.set(booking.patient._id, booking.patient);
            }
        });
        const uniquePatients = Array.from(patientMap.values());
        console.log('Unique patients:', uniquePatients);

        res.status(200).json(uniquePatients);

    } catch (error) {
        console.error('Error in /patients route:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            message: 'Error fetching patients from bookings',
            details: error.message 
        });
    }
});

// Insert new booking request - POST
router.post('/', async (req, res) => {
    const { patient, doctor, notes, date, time } = req.body;

    // Validate required fields
    if (!doctor || !patient) {
        return res.status(400).json({ message: "Doctor and patient are required." });
    }

    try {
        const bookAppointment = new BookAppointment({
            _id: await nextId('bookappointment'),
            patient,
            doctor,
            notes,
            requestStatus: 'requested',
            appointmentDate: date,
            appointmentTime: time
        });

        const savedBooking = await bookAppointment.save();
        console.log('New booking request saved:', savedBooking);

        const populatedBooking = await BookAppointment.findById(savedBooking._id)
            .populate({ path: 'patient', select: 'name dob contact' })
            .populate({ path: 'doctor', select: 'name specialization visitingHours contact' });

        res.status(201).json({
            ...populatedBooking.toObject(),
            appointmentDate: date,
            appointmentTime: time,
        });
    } catch (error) {
        console.error('Error saving booking request:', error);
        res.status(500).json({ message: 'Error saving booking request.' });
    }
});

// Approve a booking and create an appointment - PATCH
router.patch('/:id/approve', async (req, res) => {
    const { date, time } = req.body;

    // Validate required fields
    if (!date || !time) {
        return res.status(400).json({ message: "Date and time are required to approve booking." });
    }

    try {
        const booking = await BookAppointment.findById(req.params.id)
            .populate('patient', 'name dob')
            .populate('doctor', 'name specialization');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.requestStatus !== 'requested') {
            return res.status(400).json({ message: 'Only pending requests can be approved.' });
        }

        // Create a new appointment
        const appointment = new Appointment({
            _id: await nextId('appointment'),
            patient: booking.patient._id,
            doctor: booking.doctor._id,
            date,
            time,
            status: 'confirmed'
        });

        const savedAppointment = await appointment.save();

        // Update booking status and link to the appointment
        booking.requestStatus = 'approved';
        booking.appointment = savedAppointment._id;
        await booking.save();

        const populatedAppointment = await Appointment.findById(savedAppointment._id)
            .populate('patient', 'name dob contact')
            .populate('doctor', 'name specialization contact visitingHours');

        res.status(200).json({
            message: "Booking approved and appointment created successfully.",
            appointment: populatedAppointment
        });
    } catch (error) {
        console.error('Error approving booking request:', error);
        res.status(500).json({ message: 'Error approving booking request.' });
    }
});

// Update booking request - PATCH
router.patch('/:id', async (req, res) => {
    try {
        const updatedBooking = await BookAppointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('patient', 'name dob')
            .populate('doctor', 'name specialization visitingHours');

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking request:', error);
        res.status(500).json({ message: 'Error updating booking request.' });
    }
});


// Delete booking request - DELETE
router.delete('/:id', async (req, res) => {
    try {
        const deletedBooking = await BookAppointment.findByIdAndDelete(req.params.id);

        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        if (deletedBooking.appointment) {
            await Appointment.findByIdAndDelete(deletedBooking.appointment);
        }

        res.status(200).json({ message: "Booking deleted successfully.", booking: deletedBooking });
    } catch (error) {
        console.error('Error deleting booking request:', error);
        res.status(500).json({ message: 'Error deleting booking request.' });
    }
});

// Custom query for booking requests - POST
router.post('/custom', async (req, res) => {
    await selectByFields(BookAppointment, res, req.body.filter, req.body.populate);
});

module.exports = router;
