const express = require('express');
const { selectAll, selectById, saveData, updateData, deleteData, selectByFields } = require('../controllers/controller');
const { nextId } = require('../models/common_models');
const { MedicalRecord, BookAppointment, Patient } = require('../models/hospital_models');
const router = express.Router();

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

// Get all medical-records
router.get('/', async (req, res) => {
    try {
        const medicalrecords = await MedicalRecord.find()
            .populate('doctor', 'name')
            .populate('patient', 'name')
            .lean();

        res.json({
            success: true,
            medicalrecords
        });
    } catch (error) {
        console.error('Error fetching medicalrecords:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching medicalrecords',
            error: error.message
        });
    }
});

// select medical record by id - GET
router.get('/:id', async (req, res) => {
    await selectById(MedicalRecord, res, req.params.id, ['patient', 'doctor']);
});

// insert new medical record - POST
router.post('/', async (req, res) => {
    try {
        const { doctor, patient, diagnosis, treatment, currentHealthStatus, allergies } = req.body;
        const doctorId = Number(doctor);
        const patientId = Number(patient);

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
        const medicalrecord = new MedicalRecord({
            _id: await nextId('medicalrecord'),
            doctor: doctorId,
            patient: patientId,
            diagnosis,
            treatment,
            currentHealthStatus,
            allergies,
            appointment: hasApprovedBooking.appointment
        });

        await medicalrecord.save();

        // Populate and return the saved prescription
        const savedMedicalRecord = await MedicalRecord.findById(medicalrecord._id)
            .lean();

        res.status(201).json({
            success: true,
            medicalrecord: savedMedicalRecord
        });
    } catch (error) {
        console.error('Error creating medical record:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating medical record',
            error: error.message
        });
    }
});

// update medical record - PATCH
router.patch('/:id', async (req, res) => {
    await updateData(MedicalRecord, res, req.body, req.params.id);
});

// delete medical record - DELETE
router.delete('/:id', async (req, res) => {
    await deleteData(MedicalRecord, res, req.params.id);
});

// custom
router.post('/custom', async (req, res) => {
    await selectByFields(MedicalRecord, res, req.body.filter
        , req.body.populate)
})


module.exports = router;
