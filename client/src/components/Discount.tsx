import React from "react";
import { Card, Button, Alert, Table } from "react-bootstrap";
import {
  useFetchDiscountQuery,
  useInsertDiscountMutation,
  useDeleteDiscountMutation,
} from "../store/services/bar";

export const Discount = () => {
  const { data: discounts, error, isLoading } = useFetchDiscountQuery();
  const [insertDiscount, insertDiscountResult] = useInsertDiscountMutation();
  const [deleteDiscount, deleteDiscountResult] = useDeleteDiscountMutation();

  const discount = discounts?.length === 1 ? discounts[0] : null;

  console.log("Insert", insertDiscountResult);
  console.log("Delete", deleteDiscountResult);

  const loading =
    isLoading ||
    insertDiscountResult.isLoading ||
    deleteDiscountResult.isLoading;

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header as="h5">Club Discount</Card.Header>
      <Card.Body>
        {loading && <Alert variant="info">Loading...</Alert>}
        {!loading && discount && (
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
              disabled={loading}
              onClick={() => deleteDiscount()}
            >
              Disable club discount
            </Button>
          </>
        )}
        {!isLoading && !discount && (
          <>
            <Alert variant="danger">Club discount is currently disabled</Alert>
            <Button
              variant="success"
              disabled={loading}
              onClick={() => insertDiscount()}
            >
              Enable club discount
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};
