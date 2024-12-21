const app = require("../main")
const { SERVERPORT } = require("./config")

app.use("/api/usertype",require('../routes/usertype_router'))
app.use("/api/userinfo",require('../routes/user_router'))
app.use("/api/prescription",require('../routes/prescription_router'))
app.use("/api/patient",require('../routes/patient_router'))
app.use("/api/medicalrecord",require('../routes/medicalrecord_router'))
app.use("/api/doctor",require('../routes/doctor_router'))
app.use("/api/appointmenthistory",require('../routes/appointmenthistory_router'))
app.use("/api/appointment",require('../routes/appointment_router'))
app.use("/api/bookappointment",require('../routes/bookappointment_router'))
app.use("/api/admin",require('../routes/admin_router'))
app.get('*',(req,res)=>{
    res.status(404).json({message: "Page not found !!!"})
})

app.listen(SERVERPORT, () => {
    console.log("Server running in http://localhost:" + SERVERPORT)
})