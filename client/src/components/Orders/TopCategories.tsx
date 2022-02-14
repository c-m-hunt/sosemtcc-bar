import React from "react";
import { Alert, Table } from "react-bootstrap";
import { Order } from "square";
import { Product } from "../../types";
import { useFetchCoreQuery } from "../../store/services/bar";

interface TopCatgoriesProperties {
  orders: Order[];
  show: number;
}

const findProduct = (variationId: string, products: Product[]) => {
  for (const product of products) {
    for (const variation of product.variations) {
      if (variation.id === variationId) {
        return product;
      }
    }
  }
  return null;
};

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
    if (order.lineItems) {
      for (let item of order.lineItems) {
        if (item.catalogObjectId) {
          const product = findProduct(item.catalogObjectId, products);
          if (product && product.category?.id) {
            const categoryId = product.category.id;
            if (!Object.keys(acc).includes(categoryId)) {
              acc[categoryId] = [0, 0];
            }
            acc[categoryId][0] += Number(item.totalMoney?.amount);
            acc[categoryId][1] += Number(item.quantity);
          }
        }
      }
    }
    return acc;
  }, {} as { [key: string]: [number, number] });
  let topCategories = Object.keys(categoryTotals).map((categoryId) => {
    return {
      name: categories.find((category) => category.id === categoryId)?.name,
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
                <td className="money">£{(category.total / 100).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
