import React from "react";
import { Card, Button, Alert, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";

import { deleteDiscount, insertDiscount } from "../store/discount";

export const Discount = () => {
  const discount = useSelector((state: RootState) => state.discount.discount);
  const loading = useSelector((state: RootState) => state.discount.loadStatus);
  const saving = useSelector((state: RootState) => state.discount.saveStatus);
  const dispatch = useDispatch();
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header as="h5">Club Discount</Card.Header>
      <Card.Body>
        {loading === "loading" && <Alert variant="info">Loading...</Alert>}
        {loading === "succeeded" && discount && (
          <>
            <Alert variant="success">Club discount is currently enabled</Alert>
            <Table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{discount.name}</td>
                </tr>
                <tr>
                  <th>Amount</th>
                  <td>{discount.percentage}%</td>
                </tr>
                <tr>
                  <th>Categories</th>
                  <td>{discount.categoryNames?.join(", ")}</td>
                </tr>
              </tbody>
            </Table>
            <Button
              variant="danger"
              disabled={["loading"].includes(saving)}
              onClick={() => dispatch(deleteDiscount())}
            >
              Disable club discount
            </Button>
          </>
        )}
        {loading === "succeeded" && !discount && (
          <>
            <Alert variant="danger">Club discount is currently disabled</Alert>
            <Button
              variant="success"
              disabled={["loading"].includes(saving)}
              onClick={() => dispatch(insertDiscount())}
            >
              Enable club discount
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};
