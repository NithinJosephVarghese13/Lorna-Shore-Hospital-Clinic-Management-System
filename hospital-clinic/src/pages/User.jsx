import { Component } from "react";
import table from "../tools/TableCtrl";
import { getUserType } from "../tools/FormMethodCtrl";

export default class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: '',
            data: <tr><td>No Records</td></tr>
        }
        this.utype = getUserType()
    }

    async componentDidMount() {
        let cols = ['name', 'address', 'contact', "userlogin.usertype.utype"]
        this.setState(await table(cols, '/userinfo',
            `/${this.utype}/editUserInfo`, `/${this.utype}/deleteUserInfo`))
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
                                <td colSpan={6}>
                                    <a className="btn btn-success btn-sm float-end ms-5" href={`/${this.utype}/addUserInfo`}>New</a>
                                </td>
                            </tr>
                            <tr className="table-dark">
                                <th>Name</th>
                                <th>Address</th>
                                <th>Contact</th>
                                <th>User Type</th>
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