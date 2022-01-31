import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { Discount } from "./components/Discount";
import { Container } from "react-bootstrap";

const App = () => {
  return (
    <div className="App">
      <NavBar />
      <Container>
        <Discount />
      </Container>
    </div>
  );
};

export default App;
