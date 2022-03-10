import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { NavBar } from "./components/NavBar";
import { Discount } from "./components/Discount";
import { DateSummary } from "./components/Orders/DateSummary";
import { DateOverview } from "./components/Orders/DateOverview";
import { KeyForm } from "./components/App/KeyForm";

const App = () => {
  const key = useSelector((state: RootState) => state.app.key);

  return (
    <div className="App">
      <NavBar />

      <Container>
        {!key && (
          <Row>
            <Col>
              <KeyForm />
            </Col>
          </Row>
        )}
        {key && (
          <Row>
            <Col md={6} lg>
              <Discount />
            </Col>
            <Col md={6} lg>
              <DateOverview />
            </Col>
            <Col md={6} lg>
              <DateSummary />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default App;
