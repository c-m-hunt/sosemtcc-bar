import React, { useState } from "react";
import { Card, Alert, Table, Form } from "react-bootstrap";
import { Order } from "square";
import { useFetchOrdersQuery } from "../../store/services/bar";
import { filterOrdersByDate } from "../../utils";

interface DateOverviewProps {
  date?: Date;
}

export const DateOverview = ({ date }: DateOverviewProps) => {
  const { data: orders, error, isLoading } = useFetchOrdersQuery();
  if (orders && orders.length > 0 && !date) {
    date = orders[0].createdAt ? new Date(orders[0].createdAt) : new Date();
  }
  const [selectedDate, setSelectedDate] = useState(date);
  const ordersForDate = date
    ? filterOrdersByDate(orders || [], selectedDate || date)
    : [];
  const title = date
    ? `Orders for ${(selectedDate || date).toDateString()}`
    : "Orders";
  return (
    <>
      <Card>
        <Card.Header as="h5">{title}</Card.Header>
        <Card.Body>
          {isLoading && <Alert variant="info">Loading...</Alert>}
          {!isLoading && orders && selectedDate && (
            <DateSelector
              orders={orders}
              selectedDate={selectedDate}
              selectDate={(date: Date) => setSelectedDate(date)}
            />
          )}
          {!isLoading && <TopProducts orders={ordersForDate} show={5} />}
          {!isLoading && <TopCustomers orders={ordersForDate} show={5} />}
        </Card.Body>
      </Card>
    </>
  );
};

interface DateSelectorProperties {
  orders: Order[];
  selectedDate: Date;
  selectDate: (date: Date) => void;
}

export const DateSelector = ({
  orders,
  selectDate,
  selectedDate,
}: DateSelectorProperties) => {
  const dates = orders.reduce((acc, order) => {
    if (order.createdAt) {
      acc.push(new Date(order.createdAt).toDateString());
    }
    return acc;
  }, [] as string[]);

  return (
    <Form.Select
      aria-label="Select date"
      value={selectedDate.toDateString()}
      onChange={(e) => {
        selectDate(new Date(e.target.value));
      }}
    >
      {Array.from(new Set(dates)).map((date) => (
        <option key={date} value={date}>
          {date}
        </option>
      ))}
    </Form.Select>
  );
};

interface TopCustomersProperties {
  orders: Order[];
  show: number;
}

const TopCustomers = ({ orders, show }: TopCustomersProperties) => {
  const customers = orders.reduce((acc, order) => {
    if (order.tenders) {
      for (let trans of order.tenders?.filter((t) => t.type === "CARD")) {
        const card = `${trans.cardDetails?.card?.cardBrand}|${trans.cardDetails?.card?.last4}`;
        if (!Object.keys(acc).includes(card)) {
          acc[card] = 0;
        }
        acc[card] += Number(trans.amountMoney?.amount) || 0;
      }
    }
    return acc;
  }, {} as { [key: string]: number });

  const topCustomers = Object.keys(customers).map((card) => ({
    cardNo: card.split("|")[1],
    cardBrand: card.split("|")[0],
    total: customers[card],
  }));

  topCustomers.sort((a, b) => b.total - a.total);

  return (
    <>
      {" "}
      <h5>Top Customer Cards</h5>
      <Table>
        <thead>
          <tr>
            <th>Card last 4</th>
            <th>Card brand</th>
            <th className="money">Total</th>
          </tr>
        </thead>
        <tbody>
          {topCustomers.slice(0, show).map((customer) => (
            <tr key={customer.cardNo}>
              <td>{customer.cardNo}</td>
              <td>{customer.cardBrand}</td>
              <td className="money">£{(customer.total / 100).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

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
        acc[item.name!][0] += Number(item.totalMoney?.amount);
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
    <>
      <h5>Top Products</h5>
      <Table>
        <thead>
          <tr>
            <th>Product</th>
            <th className="money">Total</th>
            <th className="money">Count</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.slice(0, show).map((product) => {
            return (
              <tr key={product.name}>
                <td>{product.name}</td>
                <td className="money">£{(product.total / 100).toFixed(2)}</td>
                <td className="money">{product.quantity}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
