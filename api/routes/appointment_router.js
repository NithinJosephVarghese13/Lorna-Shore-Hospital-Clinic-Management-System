const express = require('express');
const { selectAll, selectById, deleteData, selectByFields } = require('../controllers/controller');
const { nextId } = require('../models/common_models');
const { Appointment, BookAppointment, Doctor } = require('../models/hospital_models');
const router = express.Router();

// Fetch only pending appointments - GET /pending
router.get('/pending', async (req, res) => {
    try {
        const { doctorUserInfo } = req.query;
        
        const doctor = await Doctor.findOne({ userinfo: Number(doctorUserInfo) });
        
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const pendingAppointments = await BookAppointment.find({ 
            doctor: doctor._id,
            requestStatus: 'requested'

         })
            .populate('doctor', 'name specialization visitingHours')
            .populate('patient', 'name dob contact')
            .populate('appointment', 'date time');

        console.log("Pending Appointments:", JSON.stringify(pendingAppointments, null, 2));
        res.status(200).json(pendingAppointments);
    } catch (error) {
        console.error("Error fetching pending appointments:", error);
        res.status(500).json({ message: error.message });
    }
});

// Update appointment status - PATCH /:id/status
router.patch('/:id/status', async (req, res) => {
    const { status, date, time } = req.body;

    if (!['approved', 'declined'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const booking = await BookAppointment.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (status === 'approved' && !booking.doctor) {
            return res.status(400).json({ message: "Cannot approve a booking without a doctor." });
        }

        booking.requestStatus = status;

        // Automatically create an Appointment if approved
        if (status === 'approved') {
            const appointment = new Appointment({
                _id: await nextId('appointment'),
                bookAppointment: booking._id, 
                patient: booking.patient,
                doctor: booking.doctor,
                date: date || booking.appointmentDate,  // Use provided date or booking date
                time: time || booking.appointmentTime,
                status: 'confirmed',
            });

            const savedAppointment = await appointment.save();
            booking.appointment = savedAppointment._id;
        }

        await booking.save();

        res.status(200).json({ message: `Booking ${status} successfully`, booking });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        res.status(500).json({ message: error.message });
    }
});

// select all appointments - GET
router.get('/', async (req, res) => {
    await selectAll(Appointment, res, [
        { path: 'patient', select: 'name dob contact' },
        { path: 'doctor', select: 'name specialization visitingHours' }
    ]);
});

// select appointment by id - GET
router.get('/:id', async (req, res) => {
    await selectById(Appointment, res, req.params.id, [
        { path: 'patient', select: 'name dob contact' },
        { path: 'doctor', select: 'name specialization visitingHours' }
    ]);
});

// In Appointment Router
router.get('/doctor-patients', async (req, res) => {
    try {
        const { doctorId } = req.query;
        
        if (!doctorId) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }

        // Find confirmed appointments for this doctor
        const appointments = await Appointment.find({
            doctor: doctorId,
            status: 'confirmed'
        })
        .populate({
            path: 'patient',
            select: 'name contact dob userinfo' 
        });

        // Extract unique patients
        const uniquePatients = Array.from(
            new Map(
                appointments
                    .map(appointment => appointment.patient)
                    .filter(patient => patient)
                    .map(patient => [patient._id, patient])
            ).values()
        );

        res.status(200).json(uniquePatients);
    } catch (error) {
        console.error('Error fetching doctor\'s patients:', error);
        res.status(500).json({ 
            message: 'Error fetching patients', 
            error: error.message 
        });
    }
});

// insert new appointment - POST
router.post('/', async (req, res) => {
    const { patient, doctor, date, time, status, bookAppointmentId } = req.body;

    if (!patient || !doctor || !date || !time || !bookAppointmentId) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        // Validate the linked BookAppointment
        const booking = await BookAppointment.findById(bookAppointmentId);
        if (!booking) {
            return res.status(404).json({ message: "BookAppointment not found." });
        }

        const appointment = new Appointment({
            _id: await nextId('appointment'),
            patient,
            doctor,
            date,
            time,
            status,
        });

        const savedAppointment = await appointment.save();

        // Link the appointment to the booking
        booking.appointment = savedAppointment._id;
        booking.requestStatus = "approved";
        await booking.save();

        const populatedAppointment = await Appointment.findById(savedAppointment._id)
            .populate('patient', 'name dob contact')
            .populate('doctor', 'name specialization visitingHours');

        res.status(201).json({
            message: "Appointment created successfully",
            appointment: populatedAppointment,
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: error.message });
    }
});



// update appointment - PATCH
router.patch('/:id', async (req, res) => {
    try {
        console.log(`Updating appointment ID: ${req.params.id} with data:`, req.body);
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return the updated document
        );
        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.json({
            message: "Appointment updated successfully",
            appointment: updatedAppointment, // Include the updated appointment data
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: error.message });
    }
});


// delete appointment - DELETE
router.delete('/:id', async (req, res) => {
    await deleteData(Appointment, res, req.params.id);
});

// custom
router.post('/custom', async (req, res) => {
    const { filter, populate } = req.body;
    if (!filter) {
        return res.status(400).json({ message: "Filter criteria is required" });
    }

    try {
        console.log('Custom query:', filter, 'with population:', populate);
        await selectByFields(Appointment, res, filter, populate);
    } catch (error) {
        console.error("Error in custom query:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
