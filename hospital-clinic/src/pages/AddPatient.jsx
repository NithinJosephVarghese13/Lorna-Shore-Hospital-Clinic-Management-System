import { Component } from "react"
import InputCtrl from "../tools/InputCtrl"
import FormContainer from "../tools/FormContainer"
import formSubmit from "../tools/FormSubmit"
import { TEXT_ONLY, PHONE, DATE_PATTERN } from "../tools/InputPatterns" // Adjust pattern imports if necessary
import { getDataFromURL, getUserType, title } from "../tools/FormMethodCtrl"

class AddPatient extends Component {
    constructor(props) {
        super(props)
        this.state = { message: '', data: {}, path: "/patient" }
        let t = title(this.props.method)
        this.form_title = t[0] + ' Patient'
        this.submit_title = t[1]
        this.message = t[2]
        this.utype = getUserType()
    }

    async componentDidMount() {
        // If editing, fetch patient data
        if (this.props.method !== 'POST') {
            let d = await getDataFromURL("/patient/")
            this.setState({ data: d[0], path: d[1] })
        }
    }

    submit = async (e) => {
        let fields = ["_id","name", "address", "contact", "dob", "gender"] // Include all patient fields
        let data = await formSubmit(e, fields, this.state.path, this.props.method)
        if (data.message !== undefined) {
            this.setState({ message: data.message })
        } else {
            this.setState({ message: this.message + " " + data.name })
        }
    }

    render() {
        const { data } = this.state

        return (
            <form onSubmit={this.submit}>
                {this.state.message !== '' &&
                    <div className="alert alert-warning text-center"> {this.state.message} </div>
                }
                <FormContainer title={this.form_title} submit_title={this.submit_title} back={`/${this.utype}/patient`}>

                    {/* Name field */}
                    <InputCtrl
                        defaultValue={data.name || ''}  // Prepopulate field when editing
                        label="Patient Name"
                        name="name"
                        help="Alphabets only"
                        pattern={TEXT_ONLY}
                    />

                    {/* Address field */}
                    <InputCtrl
                        defaultValue={data.address || ''}  // Prepopulate field when editing
                        label="Address"
                        name="address"
                        help="Alphabets only"
                        pattern={TEXT_ONLY}
                    />

                    {/* Contact field */}
                    <InputCtrl
                        defaultValue={data.contact || ''}  // Prepopulate field when editing
                        label="Contact"
                        name="contact"
                        help="Phone number format"
                        pattern={PHONE}  // Define appropriate pattern for phone numbers
                    />

                    {/* Date of Birth field */}
                    <InputCtrl
                        defaultValue={data.dob ? new Date(data.dob).toISOString().substring(0, 10) : ''}  // Format date properly
                        label="Date of Birth"
                        name="dob"
                        help="YYYY-MM-DD format"
                        pattern= {DATE_PATTERN}  // Define pattern for dates (e.g., YYYY-MM-DD)
                    />

                    {/* Gender field */}
                    <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" className="form-control" defaultValue={data.gender || ''}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </FormContainer>
            </form>
        )
    }
}

export default AddPatient
