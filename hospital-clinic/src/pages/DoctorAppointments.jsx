import React, { Component } from 'react';

export default class DoctorAppointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            message: '',
            isLoading: true
        };
    }

    async componentDidMount() {
        try {
            // Assuming you want to fetch appointments specific to the logged-in doctor
            const doctorData = JSON.parse(localStorage.vals);
            const userInfoId = Number(doctorData.uid);

            const response = await fetch(`http://localhost:3000/api/appointment/pending?doctorUserInfo=${userInfoId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }

            const data = await response.json();

            this.setState({
                appointments: data,
                isLoading: false
            });
        } catch (error) {
            console.error('Error fetching pending appointments:', error);
            this.setState({
                message: 'Error loading pending appointments',
                isLoading: false
            });
        }
    }

    handleAppointmentAction = async (id, status, appointment) => {
        try {
            const response = await fetch(`http://localhost:3000/api/appointment/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    date: appointment.appointmentDate,
                    time: appointment.appointmentTime
                })
            });

            if (response.ok) {
                this.setState(prevState => ({
                    appointments: prevState.appointments.filter(appt => appt._id !== id),
                    message: `Appointment ${status} successfully.`
                }));
            } else {
                const errorData = await response.json();
                this.setState({
                    message: errorData.message || `Failed to ${status} appointment.`
                });
            }
        } catch (error) {
            console.error(`Error updating appointment status to ${status}:`, error);
            this.setState({
                message: `Error updating appointment status: ${error.message}`
            });
        }
    };

    render() {
        const { appointments, message, isLoading } = this.state;

        return (
            <div className="container mt-5">
                <h2>My Pending Appointments</h2>

                {message && (
                    <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                        {message}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center">Loading appointments...</div>
                ) : (
                    <table className="table table-hover table-bordered table-striped">
                        <thead>
                            <tr className="table-dark">
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length > 0 ? (
                                appointments.map(appt => (
                                    <tr key={appt._id}>
                                        <td>{appt.patient?.name || "Patient info unavailable"}</td>
                                        <td>
                                            {appt.appointmentDate
                                                ? new Date(appt.appointmentDate).toLocaleDateString()
                                                : "Date unavailable"}
                                        </td>
                                        <td>{appt.appointmentTime || "Time unavailable"}</td>
                                        <td>
                                            <button
                                                onClick={() => this.handleAppointmentAction(appt._id, 'approved', appt)}
                                                className="btn btn-success btn-sm me-2"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => this.handleAppointmentAction(appt._id, 'declined', appt)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Decline
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No pending appointments
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}