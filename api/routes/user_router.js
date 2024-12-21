const express = require('express')
const { selectAll, selectById, saveData, updateData, deleteData, selectByFields } =
    require('../controllers/controller')
const { nextId } = require('../models/common_models')
const { UserInfo, UserType} = require('../models/user_models')
const router = express.Router()

// select all - GET
router.get('/', async (req, res) => {
    await selectAll(UserInfo, res,['userlogin.usertype'])
})

// select by id - GET
router.get('/:id', async (req, res) => {
    await selectById(UserInfo, res, req.params.id,['userlogin.usertype'])
})

// insert - POST
router.post('/', async (req, res) => {
    try {
        // Fetch the usertype ID for 'patient' from the UserType collection
        const patientType = await UserType.findOne({ utype: 'patient' });
        if (!patientType) {
            return res.status(400).json({ error: "Patient usertype not found. Please initialize the usertype collection." });
        }

        // Ensure the user type is set to 'patient' by default
        req.body.userlogin = req.body.userlogin || {}; // Ensure userlogin exists
        req.body.userlogin.usertype = patientType._id;

        // Create the new UserInfo entry
        const obj = new UserInfo(req.body);
        obj._id = await nextId("UserInfo_id");
        await saveData(obj, res);
    } catch (error) {
        console.error("Error during patient registration:", error);
        res.status(500).json({ error: "Internal server error during registration." });
    }
});



// update -PATCH
router.patch('/:id', async (req, res) => {
    await updateData(UserInfo, res, req.body, req.params.id)
})

// delete - DELETE
router.delete('/:id', async (req, res) => {
    await deleteData(UserInfo, res, req.params.id)
})

// login
router.post('/login', async (req, res) => {
    await selectByFields(UserInfo, res, req.body
        , "userlogin.usertype")
})



// custom
router.post('/custom', async (req, res) => {
    await selectByFields(UserInfo, res, req.body.filter
        , req.body.populate)
})

module.exports = router