import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { Discount } from "./components/Discount";
import { DateSummary } from "./components/Orders/DateSummary";
import { DateOverview } from "./components/Orders/DateOverview";
import { Container } from "react-bootstrap";

const App = () => {
  return (
    <div className="App">
      <NavBar />
      <Container>
        <Discount />
        <DateOverview date={new Date("2022-01-29")} />
        <DateSummary />
      </Container>
    </div>
  );
};

export default App;
