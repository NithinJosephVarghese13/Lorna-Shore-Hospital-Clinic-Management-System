const { mongoose, nextId } = require('./common_models');
const Schema = mongoose.Schema;

// Doctor Schema
const DoctorSchema = new Schema({
    _id: Number,  // Auto-incremented ID
    userinfo: { type: Number, ref: 'UserInfo', required: true },
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    contact: { type: String, required: true },
    visitingHours: {
        start: { type: String, required: true, default: '09:00' },
        end: { type: String, required: true, default: '17:00' }
    }
});

DoctorSchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await nextId('doctor');  // Get next ID for doctor
    }
    next();
});

const Doctor = mongoose.model('Doctor', DoctorSchema, 'doctor');

// Patient Schema
const PatientSchema = new Schema({
    _id: Number,  // Auto-incremented ID
    userinfo: { type: Number, ref: 'UserInfo', required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true }
});

PatientSchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await nextId('patient');  // Get next ID for patient
    }
    next();
});

const Patient = mongoose.model('Patient', PatientSchema, 'patient');

// Appointment Schema
const AppointmentSchema = new Schema({
    _id: Number,  // Auto-incremented ID
    bookAppointment: { type: Number, ref: 'BookAppointment', required: true }, // Link to the booking request
    patient: { type: Number, ref: 'Patient', required: true },
    doctor: { type: Number, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' }
});

AppointmentSchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await nextId('appointment');  // Get next ID for appointment
    }
    next();
});

const Appointment = mongoose.model('Appointment', AppointmentSchema, 'appointment');

const BookAppointmentSchema = new Schema({
    _id: Number,
    doctor: { type: Number, ref: 'Doctor', required: true },
    patient: { type: Number, ref: 'Patient', required: true },
    appointment: { type: Number, ref: 'Appointment' },
    requestDate: { type: Date, default: Date.now },
    appointmentDate: { type: Date },
    appointmentTime: { type: String },
    requestStatus: {
        type: String,
        enum: ['requested', 'approved', 'declined', 'cancelled'],
        default: 'requested'
    },
    notes: { type: String },
    approvedBy: {
        type: Number,
        ref: 'Doctor'
    },
    rejectedBy: {
        type: Number,
        ref: 'Doctor'
    },
    approvedAt: {
        type: Date
    },
    rejectedAt: {
        type: Date
    }
}, {
    timestamps: true
});

BookAppointmentSchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await nextId('book_appointment'); // Auto-incremented ID
    }
    next();
});

const BookAppointment = mongoose.model('BookAppointment', BookAppointmentSchema, 'bookappointment');

// Medical Record Schema
const MedicalRecordSchema = new Schema({
    _id: Number,  // Auto-incremented ID
    patient: { type: Number, ref: 'Patient', required: true },
    doctor: { type: Number, ref: 'Doctor', required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    currentHealthStatus: { type: String, required: true },
    allergies: { type: String, required: true }
});

MedicalRecordSchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await nextId('medical_record');  // Get next ID for medical record
    }
    next();
});

const MedicalRecord = mongoose.model('MedicalRecord', MedicalRecordSchema, 'medicalrecord');

// Prescription Schema
const PrescriptionSchema = new Schema({
    _id: Number,  // Auto-incremented ID
    appointment: { type: Number, ref: 'Appointment', required: true }, 
    patient: { type: Number, ref: 'Patient', required: true },
    doctor: { type: Number, ref: 'Doctor', required: true },
    medication: { type: String, required: true },
    dosage: { type: String, required: true },
    instructions: { type: String, required: true }
});

PrescriptionSchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await nextId('prescription');  // Get next ID for prescription
    }
    next();
});

const Prescription = mongoose.model('Prescription', PrescriptionSchema, 'prescription');

// Appointment History Schema
const AppointmentHistorySchema = new Schema({
    _id: Number, // Auto-incremented ID
    appointment: { type: Number, ref: 'Appointment', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], required: true },
    updatedAt: { type: Date, default: Date.now }
});

AppointmentHistorySchema.pre('save', async function (next) {
    if (this.isNew) {
        this._id = await nextId('appointment_history');  // Get next ID for appointment history
    }
    next();
});

const AppointmentHistory = mongoose.model('AppointmentHistory', AppointmentHistorySchema, 'appointmenthistory');

module.exports = {
    Doctor,
    Patient,
    Appointment,
    BookAppointment,
    MedicalRecord,
    Prescription,
    AppointmentHistory
};
