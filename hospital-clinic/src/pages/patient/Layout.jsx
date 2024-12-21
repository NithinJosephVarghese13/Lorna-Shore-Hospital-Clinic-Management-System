import { Navigate, Outlet } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Session from '../../tools/SessionCtrl'

const CustomerLayout = () => {
    let v = Session.getVals()
    if (v.utype !== 'patient') {
        return <Navigate to="/login" />
    }
    return <>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/patient">Lorna Shore Clinic</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/"><i className="bi bi-house-door"></i> Home</Nav.Link>
                    </Nav>
                    <Nav.Link href="/patient/appointments" className="me-3">
                        <i className="bi bi-calendar-check"></i> My Appointments
                    </Nav.Link>
                    <Nav.Link href="/patient/prescriptions" className="me-3">
                        My Prescriptions
                    </Nav.Link>
                    <Nav.Link href="/aboutus" className="me-3">
                        About Us
                    </Nav.Link>
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

export default CustomerLayout

