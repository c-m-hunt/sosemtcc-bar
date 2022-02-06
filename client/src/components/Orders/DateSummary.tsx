import React from "react";
import { Card, Alert, Table } from "react-bootstrap";
import { Order } from "square";
import { useFetchOrdersQuery } from "../../store/services/bar";
import { groupOrdersByDate } from "../../utils";

export const DateSummary = () => {
  const { data: orders, error, isLoading } = useFetchOrdersQuery();

  const ordersByDate = groupOrdersByDate(orders || []);

  return (
    <Card>
      <Card.Header as="h5">Order Summary</Card.Header>
      <Card.Body>
        {isLoading && <Alert variant="info">Loading...</Alert>}
        {ordersByDate && (
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Count</th>
                <th>Average</th>
                <th>Fees</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(ordersByDate).map((date: string) => {
                const orders = ordersByDate[date];
                const total = orders.reduce((acc, order) => {
                  const orderAmt = Number(order.netAmounts?.totalMoney?.amount);
                  return acc + orderAmt;
                }, 0);
                const fees = orders.reduce((acc, order) => {
                  const transFee = order.tenders?.reduce(
                    (accTender, tender) =>
                      accTender + Number(tender.processingFeeMoney?.amount),
                    0
                  );
                  return acc + (transFee || 0);
                }, 0);
                return (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>{orders.length}</td>
                    <td>£{(total / 100 / orders.length).toFixed(2)}</td>
                    <td>£{(fees / 100).toFixed(2)}</td>
                    <td>£{(total / 100).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};
