import React, { useState } from "react";
import { Card, Alert, Table, Form } from "react-bootstrap";
import { Order } from "square";
import { useFetchOrdersQuery } from "../../store/services/bar";
import { filterOrdersByDate } from "../../utils";
import { TopProducts } from "./TopProducts";
import { TopCustomers } from "./TopCustomers";
import { TopCategories } from "./TopCategories";

interface DateOverviewProps {
  date?: Date;
}

export const DateOverview = ({ date }: DateOverviewProps) => {
  const { data: orders, isLoading } = useFetchOrdersQuery();
  const [selectedDate, setSelectedDate] = useState(date);
  if (orders && orders.length > 0 && !selectedDate) {
    setSelectedDate(
      orders[0].createdAt ? new Date(orders[0].createdAt) : new Date()
    );
  }

  const ordersForDate = selectedDate
    ? filterOrdersByDate(orders || [], selectedDate)
    : [];
  const title = selectedDate
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
          {!isLoading && <TopCategories orders={ordersForDate} show={5} />}
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
