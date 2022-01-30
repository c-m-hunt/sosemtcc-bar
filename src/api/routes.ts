import express from "express";
import { Client, Environment } from "square";
import { getClubRateDiscount } from "../methods/discounts";

const client = new Client({
  environment: process.env.SQUARE_ENV as Environment,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const router = express.Router();

router.get("/discounts", async (req, res) => {
  const discount = await getClubRateDiscount(client);
  delete discount.raw;
  res.json(discount);
});

export default router;
