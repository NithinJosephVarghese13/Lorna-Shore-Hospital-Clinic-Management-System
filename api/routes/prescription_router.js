const express = require('express');
const { selectAll, selectById, saveData, updateData, deleteData, selectByFields } = require('../controllers/controller');
const { nextId } = require('../models/common_models');
const { Prescription, BookAppointment, Appointment, Patient, Doctor } = require('../models/hospital_models');
const router = express.Router();
// Get patients for a specific doctor based on approved bookings
router.get('/doctor-patients/:doctorId', async (req, res) => {
    try {
        const doctorId = Number(req.params.doctorId);
        console.log('Fetching patients for doctor:', doctorId);

        const approvedBookings = await BookAppointment.find({
            doctor: doctorId,
            requestStatus: 'approved'
        })
            .lean();

        console.log('Found approved bookings:', approvedBookings);

        const patientIds = approvedBookings
            .filter(booking => booking.patient != null)
            .map(booking => booking.patient);
        const uniquePatientIds = [...new Set(patientIds)];

        const patients = await Patient.find({ _id: { $in: uniquePatientIds } })
        .select('name dob contact _id')
        .lean();

    res.json({
        success: true,
        patients: patients,
        bookingsCount: approvedBookings.length
    });
} catch (error) {
    console.error('Error fetching doctor patients:', error);
    res.status(500).json({
        success: false,
        message: 'Error fetching patients',
        error: error.message
    });
}
});

// Get all prescriptions
router.get('/', async (req, res) => {
    try {
        const prescriptions = await Prescription.find()
            .populate('doctor', 'name')
            .populate('patient', 'name')
            .lean();

        res.json({
            success: true,
            prescriptions
        });
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching prescriptions',
            error: error.message
        });
    }
});

// select prescription by id - GET
router.get('/:id', async (req, res) => {
    await selectById(Prescription, res, req.params.id, ['patient', 'doctor']);
});

// Create new prescription
router.post('/', async (req, res) => {
    try {
        const { doctor, patient, medication, dosage, instructions } = req.body;
        const doctorId = Number(doctor);
        const patientId = Number(patient);

        console.log('Creating prescription with:', {
            doctorId,
            patientId,
            medication,
            dosage,
            instructions
        });

        const hasApprovedBooking = await BookAppointment.findOne({
            doctor: doctorId,
            patient: patientId,
            requestStatus: 'approved'
        });

        if (!hasApprovedBooking) {
            return res.status(400).json({
                success: false,
                message: 'No approved appointment found for this doctor-patient combination'
            });
        }

        // Create new prescription
        const prescription = new Prescription({
            _id: await nextId('prescription'),
            doctor: doctorId,
            patient: patientId,
            medication,
            dosage,
            instructions,
            appointment: hasApprovedBooking.appointment
        });

        await prescription.save();

        // Populate and return the saved prescription
        const savedPrescription = await Prescription.findById(prescription._id)
            .lean();

        res.status(201).json({
            success: true,
            prescription: savedPrescription
        });
    } catch (error) {
        console.error('Error creating prescription:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating prescription',
            error: error.message
        });
    }
});


// update prescription - PATCH
router.patch('/:id', async (req, res) => {
    await updateData(Prescription, res, req.body, req.params.id);
});

// delete prescription - DELETE
router.delete('/:id', async (req, res) => {
    await deleteData(Prescription, res, req.params.id);
});

// custom
router.post('/custom', async (req, res) => {
    await selectByFields(Prescription, res, req.body.filter
        , req.body.populate)
})

module.exports = router;
