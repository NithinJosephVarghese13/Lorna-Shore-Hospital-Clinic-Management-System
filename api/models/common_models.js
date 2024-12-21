const mongoose = require('mongoose')
const { DBPATH } = require('../bin/config')
const Schema = mongoose.Schema
mongoose.connect(DBPATH)

const CounterSchema = new Schema({
    _id: { type: String, lowercase: true, trim: true },
    seq: Number
})

const Couter = mongoose.model("Counter", CounterSchema, "counter")

// next id
const nextId = async (seqName) => {
    let cnt = await Couter.findByIdAndUpdate(
        seqName, { $inc: { seq: 1 } }, { new: true }
    )
    if (cnt == null) {
        cnt = new Couter({ _id: seqName, seq: 1 })
        await cnt.save()
    }
    return cnt.seq
}
// previous id
const prevId = async (seqName) => {
    await Couter.findByIdAndUpdate(
        seqName, { $inc: { seq: -1 } }, { new: true }
    )
}

module.exports = {
    mongoose: mongoose,
    nextId: nextId,
    prevId: prevId
}