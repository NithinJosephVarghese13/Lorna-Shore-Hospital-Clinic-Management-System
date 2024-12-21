import { Component } from "react";
import InputCtrl from "../tools/InputCtrl";
import FormContainer from "../tools/FormContainer";
import formSubmit from "../tools/FormSubmit";
import { TEXT_ONLY, DOSAGE_PATTERN } from "../tools/InputPatterns";
import { getDataFromURL, getUserType, title } from "../tools/FormMethodCtrl";
import Session from "../tools/SessionCtrl";

class AddPrescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '', data: { doctor: '', patient: '' }, path: "/prescription", patients: [], isLoading: true, doctorId: null,
            doctorName: ''
        };
        let t = title(this.props.method);
        this.form_title = t[0] + ' Prescription';
        this.submit_title = t[1];
        this.message = t[2];
        this.utype = getUserType();
    }

    async componentDidMount() {
        try {
            this.setState({ isLoading: true });

            // First, get the doctor's ID using the userinfo from session
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
                const patientsUrl = `http://localhost:3000/api/prescription/doctor-patients/${doctorData.doctorId}`;

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

                // If this is an edit operation, get the prescription data
                if (this.props.method !== 'POST') {
                    let d = await getDataFromURL("/prescription/");
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
        e.preventDefault();
        let fields = ["patient", "doctor", "medication", "dosage", "instructions"];
        try {
            const formData = { ...this.state.data, doctor: this.state.doctorId };
            let data = await formSubmit(e, fields, this.state.path, this.props.method, formData);
            if (data.message !== undefined) {
                this.setState({ message: data.message });
            } else {
                this.setState({
                    message: this.message + " Prescription created for patient ID " + data['patient']
                });
            }
        } catch (error) {
            console.error("Error submitting prescription:", error);
            this.setState({ message: "Error creating prescription" });
        }
    };

    render() {
        const { data, patients, message, doctorName, isLoading } = this.state;

        return (
            <form onSubmit={this.submit}>
                {this.state.message !== '' &&
                    <div className="alert alert-warning text-center"> {message} </div>
                }

                <FormContainer title={this.form_title} submit_title={this.submit_title} back={`/${this.utype}/prescription`}>

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

                    {/* Medication field */}
                    <InputCtrl
                        defaultValue={data.medication || ''}
                        label="Medication"
                        name="medication"
                        help="Enter the medication name"
                        pattern={TEXT_ONLY}
                    />

                    {/* Dosage field */}
                    <InputCtrl
                        defaultValue={data.dosage || ''}
                        label="Dosage"
                        name="dosage"
                        help="Enter the dosage"
                        pattern={DOSAGE_PATTERN}
                    />

                    {/* Instructions field */}
                    <InputCtrl
                        defaultValue={data.instructions || ''}
                        label="Instructions"
                        name="instructions"
                        help="Enter instructions for medication"
                        pattern={TEXT_ONLY}
                    />

                </FormContainer>
            </form>
        );
    }
}

export default AddPrescription;
