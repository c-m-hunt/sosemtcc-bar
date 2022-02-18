import { Order } from "./types";

export const groupOrdersByDate = (orders: Order[]) => {
  return orders?.reduce((acc, order) => {
    const date = new Date(order.date!);
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
    const orderDate = new Date(order.date!);
    return orderDate.toDateString() === date.toDateString();
  });
};

//Saves the key to local storage
export const saveKeyToLocalStorage = (key: string) => {
  localStorage.setItem("key", key);
};

// Gets the key from local storage
export const getKeyFromLocalStorage = () => {
  return localStorage.getItem("key");
};

// Deletes the key from local storage
export const deleteKeyFromLocalStorage = () => {
  localStorage.removeItem("key");
};
