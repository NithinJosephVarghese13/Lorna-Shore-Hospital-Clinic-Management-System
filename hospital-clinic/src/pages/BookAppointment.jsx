import { Component } from "react";
import { getUserType } from "../tools/FormMethodCtrl";
import '../index.css'

export default class BookAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            specializations: [],
            selectedSpecialization: '',
            doctors: [],
            selectedDoctor: '',
            appointmentDate: '',
            appointmentTime: '',
            notes: '',
            showCard: false,
            appointmentDetails: null,
            currentDoctor: null
        };
        this.utype = getUserType();
    }

    async componentDidMount() {
        try {
            const response = await fetch('http://localhost:3000/api/doctor/specializations');
            const specializations = await response.json();
            this.setState({ specializations });
        } catch (error) {
            console.error('Error fetching specializations:', error);
            this.setState({ message: 'Error loading specializations. Please try again.' });
        }
    }

    handleSpecializationChange = async (e) => {
        const selectedSpecialization = e.target.value;
        this.setState({
            selectedSpecialization,
            doctors: [],
            selectedDoctor: '',
            currentDoctor: null
        });

        try {
            const response = await fetch(`http://localhost:3000/api/doctor/specialization/${selectedSpecialization}`);
            const doctors = await response.json();
            this.setState({ doctors });
        } catch (error) {
            console.error('Error fetching doctors:', error);
            this.setState({ message: 'Error loading doctors. Please try again.' });
        }
    };

    handleDoctorChange = async (e) => {
        const doctorId = e.target.value;

        try {
            const selectedDoctor = this.state.doctors.find(doc => doc._id.toString() === doctorId);
            if (selectedDoctor) {
                this.setState({
                    selectedDoctor: doctorId,
                    currentDoctor: {
                        _id: selectedDoctor._id,
                        name: selectedDoctor.name,
                        specialization: selectedDoctor.specialization,
                        phone: selectedDoctor.contact, // using contact instead of phone
                        visitingHours: selectedDoctor.visitingHours || {
                            start: '09:00',
                            end: '17:00'
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error setting doctor details:', error);
            this.setState({
                message: 'Error loading doctor details. Please try again.',
                currentDoctor: null,
                selectedDoctor: ''
            });
        }
    };

    isWithinVisitingHours = (time) => {
        const { currentDoctor } = this.state;

        if (!currentDoctor || !currentDoctor.visitingHours) {
            return false;
        }

        try {
            const { visitingHours } = currentDoctor;
            const [hours, minutes] = time.split(':');
            const appointmentTime = new Date();
            appointmentTime.setHours(parseInt(hours), parseInt(minutes));

            const [startHour, startMinute] = visitingHours.start.split(':');
            const [endHour, endMinute] = visitingHours.end.split(':');

            const startTime = new Date();
            startTime.setHours(parseInt(startHour), parseInt(startMinute));

            const endTime = new Date();
            endTime.setHours(parseInt(endHour), parseInt(endMinute));

            return appointmentTime >= startTime && appointmentTime <= endTime;
        } catch (error) {
            console.error('Error checking visiting hours:', error);
            return false;
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const {
            selectedSpecialization,
            selectedDoctor,
            appointmentDate,
            appointmentTime,
            notes,
            currentDoctor
        } = this.state;

        // Step 1: Initial validations
        if (!selectedSpecialization) {
            this.setState({ message: 'Please select a specialization first.' });
            return;
        }

        if (!selectedDoctor) {
            this.setState({ message: 'Please select a doctor.' });
            return;
        }

        if (!currentDoctor) {
            this.setState({ message: 'Doctor details not loaded properly.' });
            return;
        }

        // Step 2: Date and time validations
        if (!appointmentDate || !appointmentTime) {
            this.setState({ message: 'Please select both date and time.' });
            return;
        }

        // Step 3: Validate selected time is within doctor's visiting hours
        const selectedTime = appointmentTime;
        const visitingStart = currentDoctor.visitingHours?.start || '09:00';
        const visitingEnd = currentDoctor.visitingHours?.end || '17:00';

        if (selectedTime < visitingStart || selectedTime > visitingEnd) {
            this.setState({
                message: `Please select a time between ${visitingStart} and ${visitingEnd}.`
            });
            return;
        }

        // Step 4: Get patient ID from localStorage
        const patientId = JSON.parse(localStorage.vals)?.uid;
        if (!patientId) {
            this.setState({ message: 'Patient information not found. Please login again.' });
            return;
        }

        // Step 5: Prepare appointment data
        const appointmentData = {
            doctor: selectedDoctor,
            patient: patientId,
            notes: notes || '',
            date: appointmentDate,
            time: appointmentTime
        };

        try {
            // Step 6: Send request to backend
            const response = await fetch('http://localhost:3000/api/bookappointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData)
            });

            // Step 7: Handle response
            if (response.ok) {
                const data = await response.json();
                const appointmentDetails = {
                    _id: data._id,
                    tokenNumber: data._id || 'N/A',
                    doctorName: data.doctor?.name || 'N/A',
                    doctorSpecialization: data.doctor?.specialization || 'N/A',
                    doctorContact: data.doctor?.contact || 'N/A',
                    doctorVisitingHours: `${data.doctor?.visitingHours?.start || '09:00'} - ${data.doctor?.visitingHours?.end || '17:00'}`,
                    patientName: data.patient?.name || 'N/A',
                    patientDob: data.patient?.dob || 'N/A',
                    date: appointmentDate,
                    time: appointmentTime,
                    appointmentId: data.appointment
                };
                this.setState({
                    showCard: true,
                    appointmentDetails,
                    message: 'Appointment booked successfully!'
                });
            } else {
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                this.setState({
                    message: `Failed to book appointment: ${errorData.message}`
                });
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            this.setState({
                message: 'Failed to book appointment. Please try again.'
            });
        }
    };


    handleCancelAppointment = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/appointment/${this.state.appointmentDetails._id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                if (this.state.appointmentDetails.appointmentId) {
                    await fetch(`http://localhost:3000/api/appointment/${this.state.appointmentDetails.appointmentId}`, {
                        method: 'DELETE'
                    });
                }
                this.setState({
                    showCard: false,
                    appointmentDetails: null,
                    message: 'Appointment cancelled successfully!'
                });
            } else {
                const errorData = await response.json();
                this.setState({ message: `Failed to cancel appointment: ${errorData.message}` });
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            this.setState({ message: 'Failed to cancel appointment. Please try again.' });
        }
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };
    renderAppointmentCard() {
        const { appointmentDetails, currentDoctor } = this.state;
        if (!appointmentDetails || !currentDoctor) return null;

        return (
            <div className="card mt-4 shadow-lg border-0">
                <div className="card-header bg-gradient bg-primary text-white py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">
                            <i className="fas fa-calendar-check me-2"></i>
                            Appointment Details
                        </h5>
                        <span className="badge bg-light text-primary fs-6">
                            Token: #{appointmentDetails.tokenNumber}
                        </span>
                    </div>
                </div>

                <div className="card-body p-4">
                    <div className="row">
                        {/* Doctor Details Column */}
                        <div className="col-md-6 mb-4">
                            <div className="doctor-details p-3 bg-light rounded-3">
                                <h6 className="text-primary border-bottom pb-2 mb-3">
                                    <i className="fas fa-user-md me-2"></i>
                                    Doctor Details
                                </h6>
                                <div className="ms-3">
                                    <p className="mb-2">
                                        <strong>Name:</strong>
                                        <span className="ms-2">Dr. {currentDoctor.name}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Specialization:</strong>
                                        <span className="badge bg-info text-dark ms-2">
                                            {currentDoctor.specialization}
                                        </span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Contact:</strong>
                                        <span className="ms-2">
                                            <i className="fas fa-phone-alt me-1"></i>
                                            {currentDoctor.phone}
                                        </span>
                                    </p>
                                    <p className="mb-0">
                                        <strong>Visiting Hours:</strong>
                                        <span className="ms-2">
                                            <i className="far fa-clock me-1"></i>
                                            {currentDoctor.visitingHours.start} - {currentDoctor.visitingHours.end}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Patient Details Column */}
                        <div className="col-md-6 mb-4">
                            <div className="patient-details p-3 bg-light rounded-3">
                                <h6 className="text-primary border-bottom pb-2 mb-3">
                                    <i className="fas fa-user me-2"></i>
                                    Patient Details
                                </h6>
                                <div className="ms-3">
                                    <p className="mb-2">
                                        <strong>Name:</strong>
                                        <span className="ms-2">{appointmentDetails.patientName}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Date of Birth:</strong>
                                        <span className="ms-2">
                                            <i className="fas fa-birthday-cake me-1"></i>
                                            {new Date(appointmentDetails.patientDob).toLocaleDateString()}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Time Section */}
                    <div className="appointment-time bg-primary bg-opacity-10 p-3 rounded-3 mb-4">
                        <h6 className="text-primary border-bottom pb-2 mb-3">
                            <i className="far fa-clock me-2"></i>
                            Appointment Schedule
                        </h6>
                        <div className="row ms-2">
                            <div className="col-md-6">
                                <p className="mb-2">
                                    <strong>Date:</strong>
                                    <span className="ms-2">
                                        <i className="far fa-calendar-alt me-1"></i>
                                        {new Date(appointmentDetails.date).toLocaleDateString()}
                                    </span>
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="mb-2">
                                    <strong>Time:</strong>
                                    <span className="ms-2">
                                        <i className="far fa-clock me-1"></i>
                                        {appointmentDetails.time}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Button */}
                    <div className="text-center">
                        <button
                            className="btn btn-danger btn-lg px-4"
                            onClick={this.handleCancelAppointment}
                        >
                            <i className="fas fa-times-circle me-2"></i>
                            Cancel Appointment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {
            specializations,
            selectedSpecialization,
            doctors,
            selectedDoctor,
            appointmentDate,
            appointmentTime,
            notes,
            message,
            showCard,
            currentDoctor
        } = this.state;

        return (
            <div className="container mt-5">
                {message && (
                    <div className="alert alert-warning text-center">{message}</div>
                )}

                {!showCard ? (
                    <form onSubmit={this.handleSubmit}>
                        {/* Specialization Dropdown */}
                        <div className="mb-3">
                            <label htmlFor="specialization" className="form-label">Specialization</label>
                            <select
                                id="specialization"
                                name="selectedSpecialization"
                                value={selectedSpecialization}
                                onChange={this.handleSpecializationChange}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Select a specialization</option>
                                {specializations.map((specialization, index) => (
                                    <option key={index} value={specialization}>
                                        {specialization}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Doctor Dropdown */}
                        <div className="mb-3">
                            <label htmlFor="doctor" className="form-label">Doctor</label>
                            <select
                                id="doctor"
                                name="selectedDoctor"
                                value={selectedDoctor}
                                onChange={this.handleDoctorChange}
                                className="form-select"
                                required
                                disabled={!doctors.length}
                            >
                                <option value="" disabled>
                                    {doctors.length ? 'Select a doctor' : 'Select a specialization first'}
                                </option>
                                {doctors.map(doctor => (
                                    <option key={doctor._id} value={doctor._id}>
                                        Dr. {doctor.name} ({doctor.specialization})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Visiting Hours Display - Show immediately after doctor selection */}
                        {currentDoctor && (
                            <div className="alert alert-info mb-3">
                                <h6 className="mb-2">Doctor's Visiting Hours:</h6>
                                <p className="mb-0">
                                    <strong>Dr. {currentDoctor.name}</strong> is available from{' '}
                                    <span className="badge bg-primary">
                                        {currentDoctor.visitingHours?.start || '09:00'}
                                    </span> to{' '}
                                    <span className="badge bg-primary">
                                        {currentDoctor.visitingHours?.end || '17:00'}
                                    </span>
                                </p>
                            </div>
                        )}
                        {/* Date Input */}
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="appointmentDate"
                                value={appointmentDate}
                                onChange={this.handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>

                        {/* Time Input */}
                        <div className="mb-3">
                            <label htmlFor="time" className="form-label">Time</label>
                            <input
                                type="time"
                                id="time"
                                name="appointmentTime"
                                value={appointmentTime}
                                onChange={this.handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>

                        {/* Notes Textarea */}
                        <div className="mb-3">
                            <label htmlFor="notes" className="form-label">Notes</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={notes}
                                onChange={this.handleInputChange}
                                className="form-control"
                            />
                        </div>


                        <button type="submit" className="btn btn-primary">
                            Book Appointment
                        </button>
                    </form>
                ) : (
                    this.renderAppointmentCard()
                )}
            </div>
        );
    }
}