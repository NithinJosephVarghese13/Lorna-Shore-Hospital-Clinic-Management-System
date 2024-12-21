import { Component } from "react"
import InputCtrl from "../tools/InputCtrl"
import FormContainer from "../tools/FormContainer"
import AddressCtrl from "../tools/AddressCtrl"
import formSubmit from "../tools/FormSubmit"
import { PHONE, TEXT_ONLY } from "../tools/InputPatterns"
import { getDataFromURL, getUserType, title } from "../tools/FormMethodCtrl"

export default class AddUser extends Component {

    constructor(props) {
        super(props)
        this.state = { message: '', data: {}, usertypes: [],  selectedUserType: '', }
        let t = title(this.props.method)
        this.form_title = t[0] + ' User'
        this.submit_title = t[1]
        this.message = t[2]
        this.utype = getUserType()
    }
    async componentDidMount() {
        try {
            let d = this.props.method !== 'POST' ? await getDataFromURL("/userinfo") : {};
            this.setState({
                data: d[0] || {},
                path: d[1] || '',
            });
            const response = await fetch("http://localhost:3000/api/usertype");
            const usertypes = await response.json();
            const filteredUsertypes = usertypes.filter(usertype => usertype.utype !== 'admin');
            this.setState({ usertypes: filteredUsertypes });
        } catch (error) {
            console.error("Error fetching user types:", error);
        }
    }

    submit = async (e) => {
        ////
        e.preventDefault(); 
        let fd = new FormData(e.target)
        let pwd = fd.get("userlogin.passwd")
        let cpwd = fd.get("cpasswd")
        if (pwd !== cpwd) {
            e.preventDefault()
            this.setState({ message: "Password not matching" })
            return
        }
        ////
        fd.set("userlogin.usertype", this.state.selectedUserType);
        let fields = ["name", "address", "contact",
            "userlogin.uname", "userlogin.passwd", "userlogin.usertype"]
        let path = "/userinfo"
        let data = await formSubmit(e, fields, path)
        if (data.message !== undefined) {
            this.setState({ message: data.message })
        } else {
            this.setState({ message: 'Saved ' + data.name })
        }
    }

    handleUserTypeChange = (e) => {
        this.setState({ selectedUserType: e.target.value });  
    }
    render() {
        return <form onSubmit={this.submit}>
            {
                this.state.message !== '' &&
                <div className="alert alert-warning text-center"> {this.state.message} </div>
            }
            <FormContainer title={this.form_title} submit_title={this.submit_title} back={`/${this.utype}/userInfo`}>
                <InputCtrl label="Name" name="name" help="Alphabets only" pattern={TEXT_ONLY} defaultValue={this.state.data.name} />
                <AddressCtrl label="Address" name="address" defaultValue={this.state.data.address} />
                <InputCtrl label="Contact" name="contact" help="10-digits" pattern={PHONE} defaultValue={this.state.data.contact} />
                <div className="form-group">
                        <label htmlFor="userType">User Type</label>
                        <select
                            name="userlogin.usertype"
                            className="form-control"
                            value={this.state.selectedUserType}  
                            onChange={this.handleUserTypeChange} 
                            required
                        >
                            <option value="">Select User Type</option>
                            {
                                this.state.usertypes.map((usertype) => (
                                    <option key={usertype._id} value={usertype._id}>{usertype.utype}</option>
                                ))
                            }
                        </select>
                    </div>
                <InputCtrl label="User Name" name="userlogin.uname" help="email id" type="email" />
                <InputCtrl label="Password" name="userlogin.passwd" type="password" help="password" />
                <InputCtrl label="Confirm Password" name="cpasswd" type="password" help="confirm password" />
            </FormContainer>
        </form>
    }
}
