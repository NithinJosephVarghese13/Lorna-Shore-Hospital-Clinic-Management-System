import { Component } from "react"
import InputCtrl from "../tools/InputCtrl"
import FormContainer from "../tools/FormContainer"
import formSubmit from "../tools/FormSubmit"
import { PHONE, TEXT_ONLY,  } from "../tools/InputPatterns"
import { getDataFromURL, getUserType, title } from "../tools/FormMethodCtrl"

class AddDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = { message: '', data: {}, path: "/doctor" }
        let t = title(this.props.method)
        this.form_title = t[0] + ' Doctor'
        this.submit_title = t[1]
        this.message = t[2]
        this.utype = getUserType()
    }

    async componentDidMount() {

        if (this.props.method !== 'POST') {
            let d = await getDataFromURL("/doctor/")
            this.setState({ data: d[0], path: d[1] })
        }
    }

    submit = async (e) => {
        let fields = ["name", "specialization", "contact"]
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
                <FormContainer title={this.form_title} submit_title={this.submit_title} back={`/${this.utype}/doctor`}>
                    {/* Name field */}
                    <InputCtrl
                        defaultValue={data.name || ''}  // Prepopulate the field when editing
                        label="Doctor Name"
                        name="name"
                        help="Alphabets only"
                        pattern={TEXT_ONLY}
                    />

                    {/* Specialization field */}
                    <InputCtrl
                        defaultValue={data.specialization || ''}  // Prepopulate the field when editing
                        label="Specialization"
                        name="specialization"
                        help="Alphabets only"
                        pattern={TEXT_ONLY}
                    />

                    {/* Contact field */}
                    <InputCtrl
                        defaultValue={data.contact || ''}  // Prepopulate the field when editing
                        label="Contact"
                        name="contact"
                        help="Phone number format"
                        pattern={PHONE}
                    />
                </FormContainer>
            </form>
        )
    }
}

export default AddDoctor
