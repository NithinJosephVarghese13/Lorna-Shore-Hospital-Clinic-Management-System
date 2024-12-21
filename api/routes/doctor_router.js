const express = require('express');
const { selectAll, selectById, updateData, deleteData, selectByFields, saveDoctor } = require('../controllers/controller');
const { Doctor, BookAppointment } = require('../models/hospital_models');
const router = express.Router();

router.get('/specializations', async (req, res) => {
    try {
        const specializations = await Doctor.distinct('specialization');
        res.json(specializations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch doctors by specialization
router.get('/specialization/:specialization', async (req, res) => {
    try {
        const doctors = await Doctor.find({ specialization: req.params.specialization });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// select all doctors - GET
router.get('/', async (req, res) => {
    await selectAll(Doctor, res);
});

router.get('/findByUserInfo', async (req, res) => {
    try {
        // Ensure the userinfo is cast to a number
        const userInfoId = parseInt(req.query.userinfo, 10);
        if (isNaN(userInfoId)) {
            return res.status(400).json({ 
                message: 'Invalid userinfo parameter',
                receivedValue: req.query.userinfo
            });
        }

        const doctor = await Doctor.findOne({ userinfo: userInfoId });
        if (!doctor) {
            return res.status(404).json({ 
                message: 'No doctor found for this userinfo',
                userInfoId: userInfoId
            });
        }

        res.json({ doctorId: doctor._id });
    } catch (error) {
        console.error('Error in findByUserInfo:', error);
        res.status(500).json({ 
            message: 'Error finding doctor',
            errorDetails: error.toString()
        });
    }
});


// select doctor by id - GET
router.get('/:id', async (req, res) => {
    await selectById(Doctor, res, req.params.id);
});

// insert new doctor - POST
router.post('/', saveDoctor);

router.post('/appointments', async (req, res) => {
    const { doctorId, status = 'requested' } = req.body;

    try {
        // Validate doctor ID
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Fetch appointments
        const appointments = await BookAppointment.find({
            doctor: doctor._id,
            requestStatus: status
        })
            .populate('patient', 'name contact dob') // Include patient details
            .sort({ createdAt: -1 });

        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
});


router.patch('/appointment/update', async (req, res) => {
    try {
        const { appointmentId, action, doctorId } = req.body;
        
        let updateData;
        switch(action) {
            case 'approve':
                updateData = { 
                    requestStatus: 'approved',
                    approvedBy: doctorId,
                    approvedAt: new Date()
                };
                break;
            case 'reject':
                updateData = { 
                    requestStatus: 'declined',
                    rejectedBy: doctorId,
                    rejectedAt: new Date()
                };
                break;
            default:
                return res.status(400).json({ message: 'Invalid action' });
        }

        const updatedAppointment = await BookAppointment.findByIdAndUpdate(
            appointmentId, 
            updateData, 
            { new: true }
        )
        .populate('patient', 'name contact dob')
        .populate('doctor', 'name specialization');

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).json({ 
            message: 'Error updating appointment status', 
            error: error.message 
        });
    }
});

router.get('/findByUserInfo', async (req, res) => {
    try {
        // Parse userinfo as a number
        const userInfoId = Number(req.query.userinfo);

        // Validate the parsed userInfoId
        if (isNaN(userInfoId)) {
            return res.status(400).json({
                message: 'Invalid userinfo parameter',
                receivedValue: req.query.userinfo
            });
        }

        // Query explicitly by userinfo field
        const doctor = await Doctor.findOne({ userinfo: userInfoId });

        if (!doctor) {
            return res.status(404).json({
                message: 'No doctor found for this userinfo',
                userInfoId: userInfoId
            });
        }

        res.json({ doctorId: doctor._id });
    } catch (error) {
        console.error('Error in findByUserInfo route:', error);
        res.status(500).json({
            message: 'Error finding doctor',
            errorDetails: error.message
        });
    }
});

// update doctor - PATCH
router.patch('/:id', async (req, res) => {
    await updateData(Doctor, res, req.body, req.params.id);
});

// delete doctor - DELETE
router.delete('/:id', async (req, res) => {
    await deleteData(Doctor, res, req.params.id);
});

// custom
router.post('/custom', async (req, res) => {
    await selectByFields(Doctor, res, req.body.filter
        , req.body.populate)
})

module.exports = router;
