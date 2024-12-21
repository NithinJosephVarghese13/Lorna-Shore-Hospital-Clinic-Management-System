import { Component } from "react";
import table from "../tools/TableCtrl";
import { getUserType } from "../tools/FormMethodCtrl";

export default class MedicalRecord extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: '',
            data: <tr><td>No Records</td></tr>
        }
        this.utype = getUserType()
    }

    async componentDidMount() {
        let cols = ['patient.name', 'doctor.name', 'diagnosis', 'treatment', 'currentHealthStatus', 'allergies']; 
        this.setState(await table(cols, '/medicalrecord', `/${this.utype}/editMedicalRecord`, `/${this.utype}/deleteMedicalRecord`));
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
                                <td colSpan={3}><a className="btn btn-success btn-sm float-end ms-5" href={`/${this.utype}/addMedicalRecord`}>New</a></td>
                            </tr>
                            <tr className="table-dark">
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Diagnosis</th>
                                <th>Treatment</th>
                                <th>Current Health Status</th>
                                <th>Allergies</th>
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