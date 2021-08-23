import React from "react";
// import { NavLink } from "react-router-dom";
import { Navbar,Nav,Container,NavDropdown } from "react-bootstrap";

// reference from https://react-bootstrap.netlify.app/components/navbar/
class NavigationBar extends React.Component {
    render() {
        return (
    <Navbar bg="dark" variant="dark">
    <Container>
        <Navbar.Brand href="/"><i class="fas fa-users-cog"></i> CRM Application</Navbar.Brand>
        <Nav>
            <Nav.Link href="/signup" className = {'navbar_nav'} ><i class="fas fa-user-plus"></i> Register</Nav.Link>
            <Nav.Link href="login" className = {'navbar_nav'}><i class="fas fa-sign-in-alt"></i> Login</Nav.Link>
            <NavDropdown eventKey = {3}title={ <span><i className="fa fa-user fa-fw"></i> Setting</span>}  id="collasible-nav-dropdown">
                <NavDropdown.Item href="/signup"><i class="fas fa-user-plus"></i> Register</NavDropdown.Item>
                <NavDropdown.Item href="/login"><i class="fas fa-sign-in-alt"></i> Login</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/setting"><i class="fas fa-cog"></i> Setting</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    </Container>
    </Navbar>
    
    )};
}

export default NavigationBar;

