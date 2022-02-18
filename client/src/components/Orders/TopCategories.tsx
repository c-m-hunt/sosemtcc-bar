import React from "react";
import { Alert, Table } from "react-bootstrap";
import { Order, Category } from "../../types";
import { useFetchCoreQuery } from "../../store/services/bar";

interface TopCatgoriesProperties {
  orders: Order[];
  show: number;
}

export const TopCategories = ({ orders, show }: TopCatgoriesProperties) => {
  const { data, isLoading } = useFetchCoreQuery();

  if (isLoading) {
    return <Alert variant="info">Loading...</Alert>;
  }

  const categories = data?.categories || [];
  const products = data?.products || [];
  if (categories.length === 0) {
    return <Alert variant="warn">No categories found</Alert>;
  }

  if (products.length === 0) {
    return <Alert variant="warn">No products found</Alert>;
  }

  const categoryTotals = orders.reduce((acc, order) => {
    if (order.lines) {
      for (let item of order.lines) {
        const categoryId = item.product.category?.id;
        if (categoryId) {
          if (!Object.keys(acc).includes(categoryId)) {
            acc[categoryId] = [0, 0];
          }
          acc[categoryId][0] += Number(item.total.amount);
          acc[categoryId][1] += Number(item.quantity);
        }
      }
    }
    return acc;
  }, {} as { [key: string]: [number, number] });
  let topCategories = Object.keys(categoryTotals).map((categoryId) => {
    return {
      name: categories.find((category: Category) => category.id === categoryId)?.name,
      total: categoryTotals[categoryId][0],
    };
  });

  topCategories.sort((a, b) => b.total - a.total);

  return (
    <>
      <h5>Top Categories</h5>
      <Table>
        <thead>
          <tr>
            <th>Category</th>
            <th className="money">Total</th>
          </tr>
        </thead>
        <tbody>
          {topCategories.slice(0, show).map((category) => {
            return (
              <tr key={category.name}>
                <td>{category.name}</td>
                <td className="money">£{category.total.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
