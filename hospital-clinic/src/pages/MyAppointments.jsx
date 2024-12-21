import React, { Component } from 'react';
export default class MyAppointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            selectedAppointment: null,
            message: '',
            isLoading: true
        };
        this.patientId = JSON.parse(localStorage.vals)?.uid;
    }

    componentDidMount() {
        this.fetchPatientAppointments();
    }

    fetchPatientAppointments = async () => {
        try {
            // Custom query to fetch BookAppointments for the logged-in patient
            const response = await fetch('http://localhost:3000/api/bookappointment/custom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filter: { patient: this.patientId },
                    populate: [
                        { path: 'doctor', select: 'name specialization contact visitingHours' },
                        {
                            path: 'appointment',
                            select: 'status date time',
                            populate: {
                                path: 'doctor',
                                select: 'name specialization contact visitingHours'
                            }
                        }
                    ],
                    select: 'requestStatus appointment doctor'
                })
            });

            if (response.ok) {
                const appointments = await response.json();
                console.log('Fetched Appointments:', JSON.stringify(appointments, null, 2));
                this.setState({
                    appointments,
                    isLoading: false
                });
            } else {
                throw new Error('Failed to fetch appointments');
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            this.setState({
                message: 'Failed to load appointments',
                isLoading: false
            });
        }
    };

    handleAppointmentClick = (appointment) => {
        this.setState({
            selectedAppointment: {
                _id: appointment._id,
                tokenNumber: appointment._id,
                doctorName: appointment.doctor.name,
                doctorSpecialization: appointment.doctor.specialization,
                doctorContact: appointment.doctor.contact,
                doctorVisitingHours: `${appointment.doctor.visitingHours.start} - ${appointment.doctor.visitingHours.end}`,
                date: appointment.appointment?.date,
                time: appointment.appointment?.time,
                status: appointment.requestStatus,
                appointmentId: appointment.appointment?._id
            }
        });
    };

    handleCancelAppointment = async () => {
        const { selectedAppointment } = this.state;

        try {
            // Delete the booking appointment
            const response = await fetch(`http://localhost:3000/api/bookappointment/${selectedAppointment._id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // If there's a linked appointment, delete it
                if (selectedAppointment.appointmentId) {
                    await fetch(`http://localhost:3000/api/appointment/${selectedAppointment.appointmentId}`, {
                        method: 'DELETE'
                    });
                }

                // Refresh appointments and clear selected appointment
                this.fetchPatientAppointments();
                this.setState({
                    selectedAppointment: null,
                    message: 'Appointment cancelled successfully!'
                });
            } else {
                const errorData = await response.json();
                this.setState({
                    message: `Failed to cancel appointment: ${errorData.message}`
                });
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            this.setState({
                message: 'Failed to cancel appointment. Please try again.'
            });
        }
    };

    getStatusBadgeClass = (status) => {
        switch (status) {
            case 'requested':
                return 'badge bg-warning text-dark';
            case 'approved':
                return 'badge bg-success';
            case 'declined':
                return 'badge bg-danger';
            case 'cancelled':
                return 'badge bg-secondary';
            default:
                return 'badge bg-info';
        }
    };

    renderAppointmentDetails() {
        const { selectedAppointment } = this.state;
        if (!selectedAppointment) return null;

        return (
            <div className="card mt-4 shadow-lg border-0">
                <div className="card-header bg-gradient bg-primary text-white py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">
                            <i className="fas fa-calendar-check me-2"></i>
                            Appointment Details
                        </h5>
                        <span className="badge bg-light text-primary fs-6">
                            Token: #{selectedAppointment.tokenNumber}
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
                                        <span className="ms-2">Dr. {selectedAppointment.doctorName}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Specialization:</strong>
                                        <span className="badge bg-info text-dark ms-2">
                                            {selectedAppointment.doctorSpecialization}
                                        </span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Contact:</strong>
                                        <span className="ms-2">
                                            <i className="fas fa-phone-alt me-1"></i>
                                            {selectedAppointment.doctorContact}
                                        </span>
                                    </p>
                                    <p className="mb-0">
                                        <strong>Visiting Hours:</strong>
                                        <span className="ms-2">
                                            <i className="far fa-clock me-1"></i>
                                            {selectedAppointment.doctorVisitingHours}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Appointment Time Section */}
                        <div className="col-md-6 mb-4">
                            <div className="appointment-time bg-primary bg-opacity-10 p-3 rounded-3">
                                <h6 className="text-primary border-bottom pb-2 mb-3">
                                    <i className="far fa-clock me-2"></i>
                                    Appointment Schedule
                                </h6>
                                <div className="ms-3">
                                    <p className="mb-2">
                                        <strong>Date:</strong>
                                        <span className="ms-2">
                                            <i className="far fa-calendar-alt me-1"></i>
                                            {selectedAppointment.date ? new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Not specified'}
                                        </span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Time:</strong>
                                        <span className="ms-2">
                                            <i className="far fa-clock me-1"></i>
                                            {selectedAppointment.time || 'Not specified'}
                                        </span>
                                    </p>
                                    <p className="mb-0">
                                        <strong>Status:</strong>
                                        <span className={`ms-2 ${this.getStatusBadgeClass(selectedAppointment.status)}`}>
                                            {selectedAppointment.status}
                                        </span>
                                    </p>
                                </div>
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
        const { appointments, message, isLoading } = this.state;

        return (
            <div className="container mt-5">
                {message && (
                    <div className="alert alert-warning text-center">{message}</div>
                )}

                {isLoading ? (
                    <div className="text-center">Loading appointments...</div>
                ) : (
                    <div>
                        <h2 className="mb-4">My Appointments</h2>
                        <div className="list-group">
                            {appointments.map(appointment => (
                                <div
                                    key={appointment._id}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => this.handleAppointmentClick(appointment)}
                                >
                                    <div className="mb-1">
                                        Dr. {appointment.doctor.name} - {appointment.requestStatus}
                                        <span className={`badge ${this.getStatusBadgeClass(appointment.requestStatus)} float-end`}>
                                            {appointment.requestStatus}
                                        </span>
                                    </div>
                                    <div className="mb-1">
                                        Appointment Data: 
                                        <br />
                                        Date: {appointment.appointmentDate ?
                                            new Date(appointment.appointmentDate).toLocaleDateString() :
                                            'Not specified'}
                                        <br />
                                        Time: {appointment.appointmentTime || 'Not specified'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {this.renderAppointmentDetails()}
                    </div>
                )
                }
            </div>
        );
    }
}