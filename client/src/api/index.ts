import { ClubDiscount } from "../types";
const baseUrl = "http://localhost:3030/api";

export const fetchDiscount = async () => {
  const response = await fetch(`${baseUrl}/discount`);
  const data = await response.json();
  return data as ClubDiscount;
};
