import { Component } from "react";
import InputCtrl from "../tools/InputCtrl";
import FormContainer from "../tools/FormContainer";
import formSubmit from "../tools/FormSubmit";
import { DATE_PATTERN, TIME_PATTERN } from "../tools/InputPatterns";
import { getDataFromURL, getUserType, title } from "../tools/FormMethodCtrl";

class AddAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            data: {},
            path: "/appointment",
            patients: [],
            doctors: []
        };
        let t = title(this.props.method);
        this.form_title = t[0] + ' Appointment';
        this.submit_title = t[1];
        this.message = t[2];
        this.utype = getUserType();
    }

    async componentDidMount() {
        if (this.props.method !== 'POST') {
            let d = await getDataFromURL("/appointment/");
            this.setState({ data: d[0], path: d[1] });
        }

        // Fetch patient list for the dropdown
        try {
            const response = await fetch("http://localhost:3000/api/patient");
            const patients = await response.json();
            this.setState({ patients });
        } catch (error) {
            console.error("Error fetching patients:", error);
            this.setState({ message: "Error loading patient data" });
        }


        try {
            const doctorResponse = await fetch("http://localhost:3000/api/doctor");
            const doctors = await doctorResponse.json();
            this.setState({ doctors });
        } catch (error) {
            console.error("Error fetching doctors:", error);
            this.setState({ message: "Error loading doctor data" });
        }
    }


    submit = async (e) => {
        e.preventDefault();
        let fields = ["patient", "doctor", "date", "time", "status"];
        let data = await formSubmit(e, fields, this.state.path, this.props.method);
        if (data.message !== undefined) {
            this.setState({ message: data.message + (data.appointment ? `: ${data.appointment._id}` : '') });
        } else {
            this.setState({ message: this.message });
        }
    };
    

    convertTo24Hour = (time) => {
        if (!time) return ''; // Return empty if no time is provided

        const [hours, minutesPeriod] = time.split(':');
        const [minutes, period] = minutesPeriod.split(' ');

        let hours24 = parseInt(hours, 10);
        if (period === 'PM' && hours24 < 12) {
            hours24 += 12;
        } else if (period === 'AM' && hours24 === 12) {
            hours24 = 0;
        }

        return `${String(hours24).padStart(2, '0')}:${minutes}`;
    };

    render() {
        const { data, patients, doctors } = this.state;
        const time24 = this.convertTo24Hour(data.time);

        return (
            <form onSubmit={this.submit}>
                {this.state.message !== '' &&
                    <div className="alert alert-warning text-center"> {this.state.message} </div>
                }
                <FormContainer title={this.form_title} submit_title={this.submit_title} back={`/${this.utype}/appointment`}>

                    {/* Patient dropdown */}
                    <div className="form-group">
                        <label>Patient</label>
                        <select
                            name="patient"
                            className="form-control"
                            required
                            defaultValue={data.patient || ''}
                        >
                            <option value="" disabled>Select Patient</option>
                            {patients.map(patient => (
                                <option key={patient._id} value={patient._id}>
                                    {patient.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Doctor dropdown */}
                    <div className="form-group">
                        <label>Doctor</label>
                        <select
                            name="doctor"
                            className="form-control"
                            required
                            defaultValue={data.doctor || ''}
                        >
                            <option value="" disabled>Select Doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor._id} value={doctor._id}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date field */}
                    <InputCtrl
                        defaultValue={data.date ? new Date(data.date).toISOString().substring(0, 10) : ''}
                        label="Date"
                        name="date"
                        help="YYYY-MM-DD format"
                        pattern={DATE_PATTERN}
                    />

                    {/* Time field */}
                    <InputCtrl
                        type="text"
                        defaultValue={time24}
                        label="Time"
                        name="time"
                        help="24-hour format (e.g., 14:00)"
                        pattern={TIME_PATTERN}
                    />

                    {/* Status field */}
                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" className="form-control" defaultValue={data.status || 'pending'}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </FormContainer>
            </form>
        );
    }
}

export default AddAppointment;
