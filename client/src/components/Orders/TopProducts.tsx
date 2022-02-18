import React from "react";
import { Table } from "react-bootstrap";
import { Order } from "../../types";

interface TopProductsProperties {
  orders: Order[];
  show: number;
}

export const TopProducts = ({ orders, show }: TopProductsProperties) => {
  const productTotals = orders.reduce((acc, order) => {
    if (order.lines) {
      for (let item of order.lines) {
        if (!Object.keys(acc).includes(item.name!)) {
          acc[item.name!] = [0, 0];
        }
        acc[item.name!][0] += Number(item.total.amount);
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
                <td className="money">£{product.total.toFixed(2)}</td>
                <td className="money">{product.quantity}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
