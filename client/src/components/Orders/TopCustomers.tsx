import React from "react";
import { Table } from "react-bootstrap";
import { Order } from "square";
interface TopCustomersProperties {
  orders: Order[];
  show: number;
}

export const TopCustomers = ({ orders, show }: TopCustomersProperties) => {
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
