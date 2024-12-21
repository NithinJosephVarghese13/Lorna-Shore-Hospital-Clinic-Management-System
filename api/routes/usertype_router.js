const express = require('express')
const { selectAll, selectById, saveData, updateData, deleteData, selectByFields } =
    require('../controllers/controller')
const { nextId } = require('../models/common_models')
const { UserType } = require('../models/user_models')
const router = express.Router()

// select all - GET
router.get('/', async (req, res) => {
    await selectAll(UserType, res)
})

// select by id - GET
router.get('/:id', async (req, res) => {
    await selectById(UserType, res, req.params.id)
})

// insert - POST
router.post('/', async (req, res) => {
    const obj = new UserType(req.body)
    obj._id = await nextId("UserType_id")
    await saveData(obj, res)
})

// update -PATCH
router.patch('/:id', async (req, res) => {
    await updateData(UserType, res, req.body, req.params.id)
})

// delete - DELETE
router.delete('/:id', async (req, res) => {
    await deleteData(UserType, res, req.params.id)
})

// custom
router.post('/custom', async (req, res) => {
    await selectByFields(UserType, res, req.body.filter
        , req.body.populate)
})

module.exports = router