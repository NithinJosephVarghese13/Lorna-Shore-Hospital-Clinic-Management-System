import { Component } from "react";
import InputCtrl from "../tools/InputCtrl";
import FormContainer from "../tools/FormContainer";
import formSubmit from "../tools/FormSubmit";
import { TEXT_ONLY } from "../tools/InputPatterns";
import { getDataFromURL, getUserType, title } from "../tools/FormMethodCtrl";
import Session from "../tools/SessionCtrl";

class AddMedicalRecord extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '', data: { doctor: '', patient: '' }, path: "/medicalrecord", patients: [], isLoading: true, doctorId: null,
            doctorName: ''
        };
        let t = title(this.props.method);
        this.form_title = t[0] + ' Medical Record';
        this.submit_title = t[1];
        this.message = t[2];
        this.utype = getUserType();
    }

    async componentDidMount() {

        try {
            this.setState({ isLoading: true });
            const sessionData = Session.getVals();
            const doctorResponse = await fetch(`http://localhost:3000/api/doctor/findByUserInfo?userinfo=${sessionData.uid}`);
            const doctorData = await doctorResponse.json();
            console.log('Doctor Data Received:', doctorData);

            if (!doctorData.doctorId) {
                throw new Error('No Doctor ID found');
            }

            if (doctorData.doctorId) {
                // Get doctor's details
                const doctorDetailsResponse = await fetch(`http://localhost:3000/api/doctor/${doctorData.doctorId}`);
                const doctorDetails = await doctorDetailsResponse.json();

                // Update state with doctor information
                this.setState({
                    data: { ...this.state.data, doctor: doctorData.doctorId },
                    doctorName: doctorDetails.name,
                    doctorId: doctorData.doctorId
                });

                // Fetch patients with verbose error handling
                const patientsUrl = `http://localhost:3000/api/medicalrecord/doctor-patients/${doctorData.doctorId}`;

                const patientsResponse = await fetch(patientsUrl);
                console.log('Patients Fetch Response:', patientsResponse);

                if (!patientsResponse.ok) {
                    const errorText = await patientsResponse.text();
                    console.error('Full Error Response:', errorText);
                    throw new Error(`Patients Fetch Error: Status ${patientsResponse.status}, ${errorText}`);
                }

                const patientsData = await patientsResponse.json();
                console.log('Raw Patients Response:', patientsData);

                // Update state with patients array from the response
                this.setState({
                    patients: patientsData.patients, // Access the patients array from the response
                    isLoading: false
                });
                // If editing, fetch the existing medical record data
                if (this.props.method !== 'POST') {
                    let d = await getDataFromURL("/medicalrecord/");
                    this.setState(prevState => ({
                        data: { ...d[0], doctor: prevState.doctorId },
                        path: d[1]
                    }));
                }

            }
        } catch (error) {
            console.error("Error in component initialization:", {
                message: error.message,
                stack: error.stack
            });
            this.setState({
                message: "Error initializing form data",
                isLoading: false,
                patients: []
            });
        }
    }

    submit = async (e) => {
        // Update to send IDs instead of names for patient and doctor
        let fields = ["patient", "doctor", "diagnosis", "treatment", "currentHealthStatus", "allergies"];
        try {
            const formData = { ...this.state.data, doctor: this.state.doctorId };
            let data = await formSubmit(e, fields, this.state.path, this.props.method, formData);
            if (data.message !== undefined) {
                this.setState({ message: data.message });
            } else {
                this.setState({
                    message: this.message + " Medical Record created for patient ID " + data['patient']
                });
            }
        } catch (error) {
            console.error("Error submitting medical record:", error);
            this.setState({ message: "Error creating medical record" });
        }
    }

    render() {
        const { data, patients, doctorName, message, isLoading } = this.state;

        return (
            <form onSubmit={this.submit}>
                {message && <div className="alert alert-warning text-center"> {message} </div>}

                <FormContainer title={this.form_title} submit_title={this.submit_title} back={`/${this.utype}/medicalrecord`}>

                    {/* Patient dropdown */}
                    <div className="form-group mb-3">
                        <label>Patient</label>
                        <select
                            name="patient"
                            className="form-control"
                            required
                            value={data.patient || ""}
                            onChange={e => this.setState({ data: { ...data, patient: e.target.value } })}
                        >
                            <option value="" disabled>
                                {isLoading
                                    ? "Loading patients..."
                                    : (patients.length === 0
                                        ? "No patients found"
                                        : "Select Patient")
                                }
                            </option>
                            {Array.isArray(patients) && patients.map(patient => (
                                <option key={patient._id} value={patient._id}>
                                    {patient.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Doctor dropdown */}
                    <div className="form-group mb-3">
                        <label>Doctor</label>
                        <input
                            type="text"
                            className="form-control"
                            value={doctorName || 'Unknown Doctor'}
                            disabled
                        />
                        <input
                            type="hidden"
                            name="doctor"
                            value={data.doctor || ''}
                        />
                    </div>
                    <input
                        type="hidden"
                        name="doctor"
                        value={data.doctor || ''}
                    />

                    {/* Diagnosis field */}
                    <div className="mb-3">
                        <InputCtrl
                            defaultValue={data.diagnosis || ''}
                            label="Diagnosis"
                            name="diagnosis"
                            help="Enter the diagnosis"
                            pattern={TEXT_ONLY}
                        />
                    </div>

                    {/* Treatment field */}

                    <InputCtrl
                        defaultValue={data.treatment || ''}
                        label="Treatment"
                        name="treatment"
                        help="Enter the treatment"
                        pattern={TEXT_ONLY}
                    />
                    <InputCtrl
                        defaultValue={data.currentHealthStatus|| ''}
                        label="Current Health Status"
                        name="currentHealthStatus"
                        help="Details like symptoms, vial signs"
                        pattern={TEXT_ONLY}
                    />

                    <InputCtrl
                        defaultValue={data.allergies|| ''}
                        label="Allergies"
                        name="allergies"
                        help="Any allergies the patient has"
                        pattern={TEXT_ONLY}
                    />

                </FormContainer>
            </form>
        );
    }
}

export default AddMedicalRecord;
