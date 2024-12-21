import React, { Component } from 'react';

export default class AppointmentHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
            message: '',
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch('http://localhost:3000/api/appointmenthistory');  // Adjust API endpoint as needed
            if (!response.ok) throw new Error('Failed to fetch appointment history');
            const data = await response.json();
            this.setState({ history: data });
        } catch (error) {
            console.error('Error loading appointment history:', error);
            this.setState({ message: 'Error loading appointment history' });
        }
    }

    render() {
        const { history, message } = this.state;

        return (
            <div className="container mt-5">
                <h2>Appointment History</h2>
                {message && <div className="alert alert-danger text-center">{message}</div>}

                <table className="table table-hover table-bordered table-striped">
                    <thead>
                        <tr className="table-dark">
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length > 0 ? (
                            history.map((record) => (
                                <tr key={record._id}>
                                    <td>{record.appointment?.patient || "N/A"}</td>
                                    <td>{record.appointment?.doctor || "N/A"}</td>
                                    <td>{record.appointment?.date ? new Date(record.appointment.date).toLocaleDateString() : "N/A"}</td>
                                    <td>{record.appointment?.time || "N/A"}</td>
                                    <td>{record.status}</td>
                                    <td>{record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : "N/A"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No records available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}
