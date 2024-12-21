import { Component } from "react";
import table from "../tools/TableCtrl";
import { getUserType } from "../tools/FormMethodCtrl";

export default class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: '',
            data: <tr><td>No Records</td></tr>
        }
        this.utype = getUserType()
    }

    async componentDidMount() {
        let cols = ['userlogin','role']
        this.setState(await table(cols, '/admin', `/${this.utype}/editAdmin`, `/${this.utype}/deleteAdmin`))
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
                                <td colSpan={3}><a className="btn btn-success btn-sm float-end ms-5" href={`/${this.utype}/addAdmin`}>New</a></td>
                            </tr>
                            <tr className="table-dark">
                                <th>User</th>
                                <th>User Role</th>
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