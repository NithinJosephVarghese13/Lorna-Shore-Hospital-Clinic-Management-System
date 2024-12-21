const { prevId } = require("../models/common_models")
const { Patient, Doctor } = require('../models/hospital_models');


// select all - GET
const selectAll = async (model, res, p = []) => {
    try {
        let data;
        // For BookAppointment, populate appointment along with patient and doctor
        if (model.modelName === 'BookAppointment' && p.includes('appointment')) {
            data = await model.find().populate({
                path: 'appointment',
                populate: [
                    { path: 'patient', model: 'Patient', select: 'name' },
                    { path: 'doctor', model: 'Doctor', select: 'name' }
                ]
            });
        } else if (p.length === 0) {
            data = await model.find();
        } else {
            data = await model.find().populate(p);
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// select by id - GET
const selectById = async (model, res, id, p = []) => {
    try {
        var data = ''
        if (p.length === 0)
            data = await model.findById(id)
        else
            data = await model.findById(id).populate(p)
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// select by fields
const selectByFields = async (model, res, filter, pop = null) => {
    try {
        var data = null
        if (pop == null)
            data = await model.find(filter, {})
        else
            data = await model.find(filter, {}).populate(pop).exec()
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// save/insert - POST
const saveData = async (model, res) => {
    let mn = model.collection.collectionName
    try {
        const data = await model.save()
        res.json(data)
    } catch (error) {
        prevId(mn + "_id")
        res.status(500).json({ message: error.message })
    }
}

// save/insert - POST for Patient
const savePatient = async (req, res) => {
    const { userinfo, name, address, contact, dob, gender } = req.body; // Destructure the request body
    try {
        const newPatient = new Patient({
            userinfo, // Link to UserInfo
            name,
            address,
            contact,
            dob,
            gender
        });
        const data = await newPatient.save();
        res.status(201).json(data); // Return created patient
    } catch (error) {
        prevId("patient_id");
        res.status(500).json({ message: error.message });
    }
};

// save/insert - POST for Doctor
const saveDoctor = async (req, res) => {
    const { userinfo, name, specialization, contact, visitingHours } = req.body; // Destructure the request body
    try {
        const newDoctor = new Doctor({
            userinfo, // Link to UserInfo
            name,
            specialization,
            contact,
            visitingHours
        });
        const data = await newDoctor.save();
        res.status(201).json(data); // Return created doctor
    } catch (error) {
        prevId("doctor_id");
        res.status(500).json({ message: error.message });
    }
};

// update - PATCH
const updateData = async (model, res, vals, id) => {
    try {
        const data = await model.findByIdAndUpdate(
            id, vals, { new: true }
        )
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// delete - DELETE
const deleteData = async (model, res, id) => {
    try {
        const data = await model.findByIdAndDelete(id)
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports = {
    selectAll: selectAll,
    selectById: selectById,
    saveData: saveData,
    savePatient: savePatient,
    saveDoctor: saveDoctor,
    updateData: updateData,
    deleteData: deleteData,
    selectByFields: selectByFields
}