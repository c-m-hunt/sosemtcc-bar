import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { Discount } from "./components/Discount";
import { DateSummary } from "./components/Orders/DateSummary";
import { DateOverview } from "./components/Orders/DateOverview";
import { Col, Container, Row } from "react-bootstrap";

const App = () => {
  return (
    <div className="App">
      <NavBar />
      <Container>
        <Row>
          <Col>
            <Discount />
          </Col>
          <Col>
            <DateOverview date={new Date("2022-01-29")} />
          </Col>
          <Col>
            <DateSummary />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
