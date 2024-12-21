import { Component } from "react";
import InputCtrl from "../tools/InputCtrl";
import FormContainer from "../tools/FormContainer";
import formSubmitCustom from "../tools/FormSubmitCustom";
import { Navigate } from 'react-router-dom';
import Session from "../tools/SessionCtrl";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { message: '', redirect: false, to: '/' };
    }

    fetchPatientId = async (userinfoId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/patient/custom`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filter: { userinfo: userinfoId } })
            });
            const patients = await response.json();
            if (patients.length > 0) {
                return patients[0]._id; // Return the patient's ID
            }
            console.error('No patient found for the given userinfo ID.');
            return null;
        } catch (error) {
            console.error('Error fetching patient ID:', error);
            return null;
        }
    };

    submit = async (e) => {
        let fields = ["userlogin.uname", "userlogin.passwd"];
        let path = "/userinfo/custom";
        let data = await formSubmitCustom(e, fields, "userlogin.usertype", path);
        console.log(data);

        if (data.length === 0) {
            this.setState({ message: 'Invalid UserName/Password ?' });
        } else {
            let user = data[0];
            let utype = user.userlogin.usertype.utype;
            let uid = user._id;

            if (utype === 'patient') {
                // Fetch patient ID based on userinfo ID
                const patientId = await this.fetchPatientId(uid);
                if (!patientId) {
                    this.setState({ message: 'Unable to fetch patient details. Please try again.' });
                    return;
                }
                uid = patientId; // Update uid to patient._id
            }

            Session.setVals({
                uid: uid,
                utype: utype,
                name: user.name
            });
            console.log('Session after login:', Session.getVals());
            this.setState({
                to: utype,
                redirect: true
            });
        }
    };

    render() {
        return (
            <form onSubmit={this.submit}>
                {this.state.message !== '' &&
                    <div className="alert alert-warning text-center"> {this.state.message} </div>
                }
                <FormContainer title="Login" submit_title="Login">
                    <InputCtrl label="Email" name="userlogin.uname" help="email id" type="email" />
                    <InputCtrl label="Password" name="userlogin.passwd" type="password" help="password" />
                </FormContainer>
                {this.state.redirect &&
                    <Navigate to={'/' + this.state.to} />
                }
            </form>
        );
    }
}

export default Login;
