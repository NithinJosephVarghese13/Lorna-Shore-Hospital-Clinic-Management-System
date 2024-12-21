const express = require('express')
const { selectAll, selectById, saveData, updateData, deleteData, selectByFields } =
    require('../controllers/controller')
const { nextId } = require('../models/common_models')
const { Admin } = require('../models/hospital_models')
const router = express.Router()

// select all - GET
router.get('/', async (req, res) => {
    await selectAll(Admin, res, ['userinfo'])
})

// select by id - GET
router.get('/:id', async (req, res) => {
    await selectById(Admin, res, req.params.id, ['userinfo'])
})

// insert - POST
router.post('/', async (req, res) => {
    const obj = new Admin(req.body)
    obj._id = await nextId("admin")
    await saveData(obj, res)
})

// update -PATCH
router.patch('/:id', async (req, res) => {
    await updateData(Admin, res, req.body, req.params.id)
})

// delete - DELETE
router.delete('/:id', async (req, res) => {
    await deleteData(Admin, res, req.params.id)
})

// custom
router.post('/custom', async (req, res) => {
    await selectByFields(Admin, res, req.body.filter
        , req.body.populate)
})

module.exports = router