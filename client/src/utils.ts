import { Order } from "square";

export const groupOrdersByDate = (orders: Order[]) => {
  return orders?.reduce((acc, order) => {
    const date = new Date(order.createdAt!);
    const dateString = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(order);
    return acc;
  }, {} as { [key: string]: Order[] });
};

export const filterOrdersByDate = (orders: Order[], date: Date) => {
  return orders?.filter((order) => {
    const orderDate = new Date(order.createdAt!);
    return orderDate.toDateString() === date.toDateString();
  });
};
