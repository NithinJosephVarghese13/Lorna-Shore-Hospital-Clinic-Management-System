import { Component } from "react";

export default class PendingAppointmentsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            message: ''
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch('http://localhost:3000/api/appointment/pending');
            const data = await response.json();
            this.setState({ appointments: data });
        } catch (error) {
            console.error('Error fetching pending appointments:', error);
            this.setState({ message: 'Error loading pending appointments' });
        }
    }

    handleStatusUpdate = async (id, status) => {
        try {
            const response = await fetch(`http://localhost:3000/api/appointment/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                this.setState(prevState => ({
                    appointments: prevState.appointments.filter(appt => appt._id !== id),
                    message: `Appointment ${status} successfully.`
                }));
            } else {
                this.setState({ message: `Failed to ${status} appointment.` });
            }
        } catch (error) {
            console.error(`Error updating appointment status to ${status}:`, error);
            this.setState({ message: `Error updating appointment status.` });
        }
    };

    render() {
        const { appointments, message } = this.state;
        console.log('Appointments:', this.state.appointments);

        return (
            <div className="container mt-5">
                <h2>Pending Appointments</h2>
                {message && <div className="alert alert-success">{message}</div>}

                <table className="table table-hover table-bordered table-striped">
                    <thead>
                        <tr className="table-dark">
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? (
                            appointments.map(appt => (
                                <tr key={appt._id}>
                                    <td>{appt.patient?.name || "Patient info unavailable"}</td> {/* Corrected access for patient */}
                                    <td>{appt.doctor?.name || "Doctor info unavailable"}</td> {/* Corrected access for doctor */}
                                    <td>
                                        {appt.appointmentDate
                                            ? new Date(appt.appointmentDate).toLocaleDateString()
                                            : "Date unavailable"}
                                    </td>
                                    <td>{appt.appointmentTime || "Time unavailable"}</td>
                                    <td>
                                        <button
                                            onClick={() => this.handleStatusUpdate(appt._id, 'approved')}
                                            className="btn btn-success btn-sm me-2"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => this.handleStatusUpdate(appt._id, 'declined')}
                                            className="btn btn-danger btn-sm"
                                        >
                                            Decline
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center">No pending appointments</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}
