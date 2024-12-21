import { Component } from "react";
import table from "../tools/TableCtrl";
import { getUserType } from "../tools/FormMethodCtrl";

export default class Prescription extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: '',
            data: <tr><td>No Records</td></tr>
        }
        this.utype = getUserType()
    }

    async componentDidMount() {
        try {
            let cols = ['patient.name', 'doctor.name', 'medication', 'dosage', 'instructions'];
            const result = await table(
                cols,
                '/prescription',
                `/${this.utype}/editPrescription`,
                `/${this.utype}/deletePrescription`
            );
            this.setState(result);
        } catch (error) {
            console.error('Error:', error);
            this.setState({
                message: 'Error loading prescriptions',
                data: null
            });
        }
    }


    render() {
        return <div className="container mt-5">
            {
                this.state.message !== '' ?
                    <div className="alert alert-warning text-center"> {this.state.message} </div>
                    :
                    <table className="table table-hover table-bordered table-striped">
                        <thead>
                            <tr className="table-danger">
                                <td colSpan={3}><a className="btn btn-success btn-sm float-end ms-5" href={`/${this.utype}/addPrescription`}>New</a></td>
                            </tr>
                            <tr className="table-dark">
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Medication</th>
                                <th>Dosage</th>
                                <th>Instructions</th>
                                <th colSpan={2} className="w-25">
                                    Modify
                                </th>
                            </tr>
                        </thead>
                        <tbody>{this.state.data}</tbody>
                    </table>
            }
        </div>
    }
}