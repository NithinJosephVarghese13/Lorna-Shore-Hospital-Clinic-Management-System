import { Navigate, Outlet } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Session from '../../tools/SessionCtrl'
import NavDropdown from 'react-bootstrap/NavDropdown'

const AdminLayout = () => {
    let v = Session.getVals()
    if (v.utype !== 'admin') {
        return <Navigate to="/login" />
    }
    return <>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/admin">Lorna Shore Clinic</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/admin"><i className="bi bi-house-door"></i> Home</Nav.Link>
                        <NavDropdown title="Clinic Management" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/admin/doctor">Doctors</NavDropdown.Item>
                            <NavDropdown.Item href="/admin/patient">Patients</NavDropdown.Item>
                            <NavDropdown.Item href="/admin/appointment">Appointments</NavDropdown.Item>
                            <NavDropdown.Item href="/admin/medicalrecord">Medical Records</NavDropdown.Item>
                            <NavDropdown.Item href="/admin/prescription">Prescriptions</NavDropdown.Item>
                            <NavDropdown.Item href="/admin/appointmenthistory">Appointment History</NavDropdown.Item>
                            <NavDropdown.Item href="/admin/appointment/pending">Pending Appointments</NavDropdown.Item>

                            {/* <NavDropdown.Divider /> */}
                        </NavDropdown>
                        <NavDropdown title="User Management" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/admin/userInfo">Users</NavDropdown.Item>
                            {/* <NavDropdown.Divider /> */}
                        </NavDropdown>
                        <Nav.Link href="/admin/aboutus">
                            About Us
                        </Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
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
}

export default AdminLayout

