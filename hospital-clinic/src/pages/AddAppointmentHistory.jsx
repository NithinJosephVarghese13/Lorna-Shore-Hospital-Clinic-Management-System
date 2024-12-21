import { Component } from "react"
import InputCtrl from "../tools/InputCtrl"
import FormContainer from "../tools/FormContainer"
import formSubmit from "../tools/FormSubmit"
import { TEXT_ONLY } from "../tools/InputPatterns"
import { getDataFromURL, getUserType, title } from "../tools/FormMethodCtrl"


class AddAppointmentHistory extends Component {

    constructor(props) {
        super(props)
        this.state = { message: '', data: {}, path: "/appointmenthistory" }
        let t = title(this.props.method)
        this.form_title = t[0] + ' AppointmentHistory'
        this.submit_title = t[1]
        this.message = t[2]
        this.utype = getUserType()
    }
    async componentDidMount() {
        if (this.props.method !== 'POST') {
            let d = await getDataFromURL("/appointmenthistory/")
            this.setState({ data: d[0], path: d[1] })
        }
    }
    submit = async (e) => {
        let fields = ["appointment", "status", "updatedAt"]
        let data = await formSubmit(e, fields, this.state.path, this.props.method)
        if (data.message !== undefined) {
            this.setState({ message: data.message })
        } else {
            this.setState({ message: this.message + " " + data.appointmenthistory })
        }
    }
    render() {
        return <form onSubmit={this.submit}>
            {
                this.state.message !== '' &&
                <div className="alert alert-warning text-center"> {this.state.message} </div>
            }
            <FormContainer title={this.form_title} submit_title={this.submit_title} back={`/${this.utype}/appointmenthistory`}>
                <InputCtrl defaultValue={this.state.data.appointmenthistory} label="Appointment History" name="appointmenthistory" help="Alphabets only" pattern={TEXT_ONLY} />
            </FormContainer>
        </form>
    }
}
export default AddAppointmentHistory