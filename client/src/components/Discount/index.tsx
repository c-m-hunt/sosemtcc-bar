import React from "react";
import { Card, Button, Alert, Table } from "react-bootstrap";
import {
  useFetchCoreQuery,
  useInsertDiscountMutation,
  useDeleteDiscountMutation,
} from "../../store/services/bar";
import { EnableDiscountForm } from "./EnableForm";

export const Discount = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch: refetchCore,
  } = useFetchCoreQuery();
  const [insertDiscount, insertDiscountResult] = useInsertDiscountMutation();
  const [deleteDiscount, deleteDiscountResult] = useDeleteDiscountMutation();
  const discount = data?.discount?.length === 1 ? data?.discount[0] : undefined;

  const loading =
    isLoading ||
    isFetching ||
    insertDiscountResult.isLoading ||
    deleteDiscountResult.isLoading;

  let loadingMessage = "Loading...";

  if (insertDiscountResult.isLoading) {
    loadingMessage = "Adding club discount...";
  }
  if (deleteDiscountResult.isLoading) {
    loadingMessage = "Deleting club discount...";
  }

  const handleInsertDiscount = (categories: string[], discount: number) => {
    insertDiscount({
      categories,
      discount,
    }).then(() => {
      refetchCore();
    });
  };

  const handleDeleteDiscount = () => {
    deleteDiscount().then(() => {
      refetchCore();
    });
  };

  return (
    <Card>
      <Card.Header as="h5">Club Discount</Card.Header>
      <Card.Body>
        {loading && <Alert variant="info">{loadingMessage}</Alert>}
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
              onClick={handleDeleteDiscount}
            >
              Disable club discount
            </Button>
          </>
        )}
        {!loading && !discount && (
          <>
            <Alert variant="danger">Club discount is currently disabled</Alert>
            <EnableDiscountForm
              loading={loading}
              enableDiscount={(categories, discount) => {
                handleInsertDiscount(categories, discount);
              }}
            />
          </>
        )}
      </Card.Body>
    </Card>
  );
};
