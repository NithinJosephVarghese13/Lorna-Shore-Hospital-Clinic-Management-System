import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from './pages/admin/Layout';
import AdminHome from './pages/admin/Home';
import PatientLayout from './pages/patient/Layout';
import PatientHome from './pages/patient/Home';
import DoctorLayout from './pages/doctor/Layout';
import DoctorHome from './pages/doctor/Home';
import DoctorAppointments from "./pages/DoctorAppointments";
import Logout from "./pages/Logout";
import MedicalRecord from "./pages/MedicalRecord";
import AddMedicalRecord from "./pages/AddMedicalRecord";
import Patient from "./pages/Patient";
import AddPatient from "./pages/AddPatient";
import Doctor from "./pages/Doctor";
import AddDoctor from "./pages/AddDoctor";
import Appointment from "./pages/Appointment";
import AddAppointment from "./pages/AddAppointment";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import PendingAppointmentsDashboard from "./pages/PendingAppointmentDashboard";
import AppointmentHistory from "./pages/AppointmentHistory";
import PrescriptionList from "./pages/MyPrescriptions";
import Prescription from "./pages/Prescription";
import AddPrescription from "./pages/AddPrescription";
import User from "./pages/User";
import AddUser from "./pages/AddUser";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Session from "./tools/SessionCtrl";

const v = Session.getVals();
console.log("Session data:", v);

const MyRouter = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<Login />} />
                <Route path="logout" element={<Logout />} />
                <Route path="register" element={<Register />} />
                <Route path="aboutus" element={<AboutUs />} />
                <Route path="privacypolicy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NoPage />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminHome />} />

                <Route path="appointment" element={<Appointment />} />
                <Route path="addAppointment" element={<AddAppointment method="POST" />} />
                <Route path="editAppointment/:id" element={<AddAppointment method="PATCH" />} />
                <Route path="deleteAppointment/:id" element={<AddAppointment method="DELETE" />} />

                <Route path="medicalrecord" element={<MedicalRecord />} />
                <Route path="addMedicalrecord" element={<AddMedicalRecord method="POST" />} />
                <Route path="editMedicalrecord/:id" element={<AddMedicalRecord method="PATCH" />} />
                <Route path="deleteMedicalrecord/:id" element={<AddMedicalRecord method="DELETE" />} />


                <Route path="patient" element={<Patient />} />
                <Route path="addPatient" element={<AddPatient method="POST" />} />
                <Route path="editPatient/:id" element={<AddPatient method="PATCH" />} />
                <Route path="deletePatient/:id" element={<AddPatient method="DELETE" />} />

                <Route path="doctor" element={<Doctor />} />
                <Route path="addDoctor" element={<AddDoctor method="POST" />} />
                <Route path="editDoctor/:id" element={<AddDoctor method="PATCH" />} />
                <Route path="deleteDoctor/:id" element={<AddDoctor method="DELETE" />} />

                <Route path="prescription" element={<Prescription />} />
                <Route path="addPrescription" element={<AddPrescription method="POST" />} />
                <Route path="editPrescription/:id" element={<AddPrescription method="PATCH" />} />
                <Route path="deletePrescription/:id" element={<AddPrescription method="DELETE" />} />



                <Route path="userInfo" element={<User />} />
                <Route path="addUserInfo" element={<AddUser method="POST" />} />
                <Route path="editUserInfo/:id" element={<AddUser method="PATCH" />} />
                <Route path="deleteUserInfo/:id" element={<AddUser method="DELETE" />} />

                <Route path="aboutus" element={<AboutUs />} />

                <Route path="privacypolicy" element={<PrivacyPolicy />} />

                <Route path="appointment/pending" element={<PendingAppointmentsDashboard />} />

                <Route path="appointmenthistory" element={<AppointmentHistory />} />


                <Route path="*" element={<NoPage />} />
            </Route>
            <Route path="/patient" element={<PatientLayout />}>
                <Route index element={<PatientHome />} />
                <Route path="bookAppointment" element={<BookAppointment />} />
                <Route path="appointments" element={<MyAppointments />} />
                <Route path="*" element={<NoPage />} />
                <Route path="/patient/prescriptions" element={<PrescriptionList patientId={v?.id} />} />

                <Route path="aboutus" element={<AboutUs />} />

                <Route path="privacypolicy" element={<PrivacyPolicy />} />
            </Route>

            <Route path="/doctor" element={<DoctorLayout />}>
                <Route index element={<DoctorHome />} />
                <Route path="appointment" element={<DoctorAppointments />} />

                <Route path="medicalrecord" element={<MedicalRecord />} />
                <Route path="addMedicalrecord" element={<AddMedicalRecord method="POST" />} />
                <Route path="editMedicalrecord/:id" element={<AddMedicalRecord method="PATCH" />} />
                <Route path="deleteMedicalrecord/:id" element={<AddMedicalRecord method="DELETE" />} />


                <Route path="patient" element={<Patient />} />
                <Route path="addPatient" element={<AddPatient method="POST" />} />
                <Route path="editPatient/:id" element={<AddPatient method="PATCH" />} />
                <Route path="deletePatient/:id" element={<AddPatient method="DELETE" />} />

                <Route path="prescription" element={<Prescription />} />
                <Route path="addPrescription" element={<AddPrescription method="POST" />} />
                <Route path="editPrescription/:id" element={<AddPrescription method="PATCH" />} />
                <Route path="deletePrescription/:id" element={<AddPrescription method="DELETE" />} />
                <Route path="aboutus" element={<AboutUs />} />

                <Route path="privacypolicy" element={<PrivacyPolicy />} />

                <Route path="appointmenthistory" element={<AppointmentHistory />} />

            </Route>

        </Routes >
    </BrowserRouter >
}

export default MyRouter;
