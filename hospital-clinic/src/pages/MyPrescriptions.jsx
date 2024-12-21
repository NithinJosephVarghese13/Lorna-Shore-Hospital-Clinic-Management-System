import React, { Component } from 'react';
import Session from '../tools/SessionCtrl';

class PrescriptionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prescriptions: [],
            message: '',
        };
    }

    async componentDidMount() {
        // Fetch patientId from props or session
        const patientId = this.props.patientId || Session.getVals().uid; // Correct field for ID
        console.log('Resolved patient ID:', patientId); // Log resolved patient ID

        if (!patientId) {
            this.setState({ message: 'Invalid patient ID. Please log in again.' });
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/patient/${patientId}/prescriptions`);
            console.log('Fetch response:', response); // Log the fetch response for debugging

            if (!response.ok) {
                const errorDetails = await response.text(); // Capture error details
                console.error('Error response text:', errorDetails);
                throw new Error('Failed to fetch prescriptions');
            }

            const prescriptions = await response.json();
            console.log('Fetched prescriptions:', prescriptions); // Log fetched prescriptions
            this.setState({ prescriptions });
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            this.setState({ message: 'Error fetching prescriptions. Please try again later.' });
        }
    }


    render() {
        const { prescriptions, message } = this.state;

        return (
            <div className="container mt-4">
                <h3>My Prescriptions</h3>
                {message && <div className="alert alert-warning text-center">{message}</div>}
                {prescriptions.length > 0 ? (
                    <table className="table table-hover table-bordered">
                        <thead>
                            <tr className="table-dark">
                                <th>Medication</th>
                                <th>Dosage</th>
                                <th>Instructions</th>
                                <th>Doctor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptions.map((prescription) => (
                                <tr key={prescription._id}>
                                    <td>{prescription.medication}</td>
                                    <td>{prescription.dosage}</td>
                                    <td>{prescription.instructions}</td>
                                    <td>{prescription.doctor?.name || 'N/A'} ({prescription.doctor?.specialization || 'N/A'})</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No prescriptions available.</p>
                )}
            </div>
        );
    }
}

export default PrescriptionList;
