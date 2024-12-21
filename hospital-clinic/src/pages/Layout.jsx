import { Outlet } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Layout = () => {
    return <>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">Lorna Shore Clinic</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/"><i className="bi bi-house-door"></i> Home</Nav.Link>
                        <Nav.Link href="/login"><i className="bi bi-box-arrow-in-right"></i> Login</Nav.Link>
                        <Nav.Link href="/register"><i className="bi bi-pencil-square"></i> Register</Nav.Link>
                        <Nav.Link href="/aboutus">
                            About Us
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Outlet />
    </>
}

export default Layout

