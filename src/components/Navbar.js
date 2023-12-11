import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavbarBootstrap from 'react-bootstrap/Navbar';
import './styles.css';

const Navbar = () => {
  return (
    <NavbarBootstrap bg="dark" variant="dark">
      <Container>
        <NavbarBootstrap.Brand href="/">LOGO</NavbarBootstrap.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/create">Post</Nav.Link>
          <Nav.Link href="/featured">Featured</Nav.Link>
          <Nav.Link href="/search">Recipe Search</Nav.Link>
        </Nav>
      </Container>
    </NavbarBootstrap>
  );
};

export default Navbar;
