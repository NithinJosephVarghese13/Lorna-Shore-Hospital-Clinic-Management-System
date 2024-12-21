const express = require('express');
const { selectAll, selectById, savePatient, updateData, deleteData, selectByFields } = require('../controllers/controller');
const { Patient, Prescription } = require('../models/hospital_models');
const router = express.Router();

// select all patients - GET
router.get('/', async (req, res) => {
    try {
        let query = {};
        
        // If doctor query parameter exists, add it to the query
        if (req.query.doctor) {
            query.doctor = Number(req.query.doctor);
        }

        const patients = await Patient.find(query)
            .populate('userinfo', 'name')
            .select('_id name dob contact');

        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: error.message });
    }
});



// Fetch patients for dropdown - GET /dropdown
router.get('/dropdown', async (req, res) => {
    try {
        const patients = await Patient.find({}, '_id name'); // Fetch only _id and name fields
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id/prescriptions', async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.params.id }).populate('doctor', 'name specialization');
        if (!prescriptions.length) {
            return res.status(404).json({ message: 'No prescriptions found for this patient' });
        }
        res.json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ message: 'Error fetching prescriptions' });
    }
});

// select patient by id - GET
router.get('/:id', async (req, res) => {
    await selectById(Patient, res, req.params.id);
});

// insert new patient - POST
router.post('/', savePatient);

// update patient - PATCH
router.patch('/:id', async (req, res) => {
    await updateData(Patient, res, req.body, req.params.id);
});

// delete patient - DELETE
router.delete('/:id', async (req, res) => {
    await deleteData(Patient, res, req.params.id);
});

// custom
router.post('/custom', async (req, res) => {
    await selectByFields(Patient, res, req.body.filter
        , req.body.populate)
})


module.exports = router;
