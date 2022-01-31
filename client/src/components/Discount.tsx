import React from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
// import { ClubDiscount } from "./../types";


export const Discount = () => {
  const discount = useSelector((state: RootState) => state.discount.discount);
  const loading = useSelector((state: RootState) => state.discount.loadStatus);
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header as="h5">Club Discount</Card.Header>
      <Card.Body>
        {loading === "loading" && <Alert variant="info">Loading...</Alert>}
        {loading === "succeeded" && discount && (
          <>
            <Alert variant="success">Club discount is currently enabled</Alert>

            <Button variant="danger">Disable club discount</Button>
          </>
        )}
        {loading === "succeeded" &&  !discount && (
          <>
            <Alert variant="danger">Club discount is currently disabled</Alert>
            <Button variant="success">Enable club discount</Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};