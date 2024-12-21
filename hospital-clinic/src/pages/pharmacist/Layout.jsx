import { Navigate, Outlet } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Session from "../../tools/SessionCtrl";

const PharmacistLayout = () => {
    let v = Session.getVals();


    if (!v || v.utype !== 'pharmacist') {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/pharmacist">Lorna Shore Clinic</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/"><i className="bi bi-house-door"></i> Home</Nav.Link>
                            <NavDropdown title="Pharmacy Management" id="pharmacist-nav-dropdown">
                                <NavDropdown.Item href="/pharmacist/prescription">Manage Prescriptions</NavDropdown.Item>
                                <NavDropdown.Item href="/pharmacist/medicalrecord">View Medical Records</NavDropdown.Item>
                                <NavDropdown.Item href="/pharmacist/patient">Patient Medication History</NavDropdown.Item>
                            </NavDropdown>

                        </Nav>
                        <Nav className="ms-auto"> {/* Updated class name */}
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

export default PharmacistLayout;
