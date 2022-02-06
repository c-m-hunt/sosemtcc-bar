import React from "react";
import { Card, Alert, Table } from "react-bootstrap";
import { Order } from "square";
import { useFetchOrdersQuery } from "../../store/services/bar";
import { filterOrdersByDate } from "../../utils";

interface DateOverviewProps {
  date: Date;
}

export const DateOverview = ({ date }: DateOverviewProps) => {
  const { data: orders, error, isLoading } = useFetchOrdersQuery();

  const ordersForDate = filterOrdersByDate(orders || [], date);

  return (
    <Card>
      <Card.Header as="h5">Orders for {date.toDateString()}</Card.Header>
      <Card.Body>
        {isLoading && <Alert variant="info">Loading...</Alert>}
        {!isLoading && <TopProducts orders={ordersForDate} show={5} />}
      </Card.Body>
    </Card>
  );
};

interface BestCustomersProperties {
  orders: Order[];
  show: number;
}

interface TopProductsProperties {
  orders: Order[];
  show: number;
}

const TopProducts = ({ orders, show }: TopProductsProperties) => {
  const productTotals = orders.reduce((acc, order) => {
    if (order.lineItems) {
      for (let item of order.lineItems) {
        if (!Object.keys(acc).includes(item.name!)) {
          acc[item.name!] = [0, 0];
        }
        acc[item.name!][0] += Number(item.basePriceMoney?.amount);
        acc[item.name!][1] += Number(item.quantity);
      }
    }
    return acc;
  }, {} as { [key: string]: [number, number] });

  let topProducts = Object.keys(productTotals).map((product) => {
    return {
      name: product,
      total: productTotals[product][0],
      quantity: productTotals[product][1],
    };
  });

  topProducts.sort((a, b) => b.total - a.total);

  return (
    <Table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Total</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {topProducts.slice(0, show).map((product) => {
          return (
            <tr key={product.name}>
              <td>{product.name}</td>
              <td>£{(product.total / 100).toFixed(2)}</td>
              <td>{product.quantity}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
