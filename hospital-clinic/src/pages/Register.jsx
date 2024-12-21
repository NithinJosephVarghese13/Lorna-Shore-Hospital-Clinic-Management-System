import { Component } from "react"
import InputCtrl from "../tools/InputCtrl"
import FormContainer from "../tools/FormContainer"
import AddressCtrl from "../tools/AddressCtrl"
import formSubmit from "../tools/FormSubmit"
import { PHONE, TEXT_ONLY } from "../tools/InputPatterns"

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
        };
    }

    submit = async (e) => {
        e.preventDefault(); 
        let fd = new FormData(e.target)
        let pwd = fd.get("userlogin.passwd")
        let cpwd = fd.get("cpasswd")
        if (pwd !== cpwd) {
            e.preventDefault()
            this.setState({ message: "Password not matching" })
            return
        }
        let fields = ["name", "address", "contact",
            "userlogin.uname", "userlogin.passwd"]
        let path = "/userinfo"
        let data = await formSubmit(e, fields, path)
        if (data.message !== undefined) {
            this.setState({ message: data.message })
        } else {
            this.setState({ message: 'Saved ' + data.name })
        }
    }
    render() {
        return <form onSubmit={this.submit}>
            {
                this.state.message !== '' &&
                <div className="alert alert-warning text-center"> {this.state.message} </div>
            }
            <FormContainer title="Register" submit_title="Register">
                <InputCtrl label="Name" name="name" help="Alphabets only" pattern={TEXT_ONLY} />
                <AddressCtrl label="Address" name="address" />
                <InputCtrl label="Contact" name="contact" help="10-digits" pattern={PHONE} />
                <InputCtrl label="Email" name="userlogin.uname" help="email id" type="email" />
                <InputCtrl label="Password" name="userlogin.passwd" type="password" help="password" />
                <InputCtrl label="Confirm Password" name="cpasswd" type="password" help="confirm password" />
            </FormContainer>
        </form>
    }
}
export default Register