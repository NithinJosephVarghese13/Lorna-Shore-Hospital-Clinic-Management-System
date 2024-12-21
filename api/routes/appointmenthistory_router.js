const express = require('express');
const { selectAll, selectById, saveData, updateData, deleteData, selectByFields } = require('../controllers/controller');
const { nextId } = require('../models/common_models');
const { AppointmentHistory } = require('../models/hospital_models');
const router = express.Router();

// select all appointment histories - GET
router.get('/', async (req, res) => {
    await selectAll(AppointmentHistory, res, ['appointment']);
});

// select appointment history by id - GET
router.get('/:id', async (req, res) => {
    await selectById(AppointmentHistory, res, req.params.id, ['appointment']);
});

// insert new appointment history - POST
router.post('/', async (req, res) => {
    const obj = new AppointmentHistory(req.body);
    obj._id = await nextId('appointment_history');
    await saveData(obj, res);
});

// update appointment history - PATCH
router.patch('/:id', async (req, res) => {
    await updateData(AppointmentHistory, res, req.body, req.params.id);
});

// delete appointment history - DELETE
router.delete('/:id', async (req, res) => {
    await deleteData(AppointmentHistory, res, req.params.id);
});

// custom
router.post('/custom', async (req, res) => {
    await selectByFields(AppointmentHistory, res, req.body.filter
        , req.body.populate)
})


module.exports = router;
