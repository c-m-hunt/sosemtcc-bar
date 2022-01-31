import React from "react";
import { Navbar, Container } from "react-bootstrap";

export const NavBar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">SOSEMTCC Bar</Navbar.Brand>
      </Container>
    </Navbar>
  );
};
