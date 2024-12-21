const { FILEPATH} = require('../bin/config')
const fs = require('fs/promises')


// insert
const saveFile = async (model, req) => {
    try {
        var file = req.files[0].originalname.split(".")
        let fileName = model._id + "." + file[file.length - 1]
        model.img = fileName
        fileName = FILEPATH + fileName
        let fdata = await fs.readFile(req.files[0].path)
        await fs.writeFile(fileName, fdata)
        const data = await model.save()
        return data
    } catch (error) {
        return { message: error.message }
    }
}

// delete
const deleteFile = async (model, id) => {
    try {
        const data = await model.findByIdAndDelete(id)
        let file = FILEPATH + data.img
        await fs.unlink(file)
        return data
    } catch (error) {
        return { message: error.message }
    }
}
module.exports = {
    saveFile: saveFile,
    deleteFile: deleteFile
}
