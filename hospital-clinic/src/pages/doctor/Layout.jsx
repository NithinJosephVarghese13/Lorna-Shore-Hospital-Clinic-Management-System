import { Navigate, Outlet } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Session from "../../tools/SessionCtrl";

const DoctorLayout = () => {
    let v = Session.getVals();


    if (!v || v.utype !== 'doctor') {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/doctor">Lorna Shore Clinic</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/"><i className="bi bi-house-door"></i> Home</Nav.Link>
                            <NavDropdown title="Doctor Dashboard" id="doctor-nav-dropdown">
                                <NavDropdown.Item href="/doctor/patient">My Patients</NavDropdown.Item>
                                <NavDropdown.Item href="/doctor/appointment">My Appointments</NavDropdown.Item>
                                <NavDropdown.Item href="/doctor/medicalrecord">My Medical Records</NavDropdown.Item>
                                <NavDropdown.Item href="/doctor/prescription">Prescriptions</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="/aboutus">
                                About Us
                            </Nav.Link>
                        </Nav>
                        <Nav className="ms-auto"> 
                            <Nav.Link href="/logout">
                                <i className="bi bi-box-arrow-in-left"></i>
                                Logout
                                <span className="text-warning ms-2">
                                    {v.name}
                                </span>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </>
    );
}

export default DoctorLayout;
