import express from "express";
import { Client, Environment } from "square";
import {
  deleteClubRateDiscount,
  getClubRateDiscount,
  insertClubRateDiscount,
} from "../methods/discounts";
import {
  getCategories,
  getLocations,
  getOrdersForLocations,
  getProducts,
} from "../methods/general";
import { ClubDiscount, ClubDiscountWithRaw } from "../types";
import { authenticate } from "./middleware";

const client = new Client({
  environment: process.env.SQUARE_ENV as Environment,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const router = express.Router();

// router.use(authenticate);

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

router.get("/core", async (req, res) => {
  let discount: ClubDiscountWithRaw[];
  try {
    discount = [await getClubRateDiscount(client)];
    delete discount[0].raw;
  } catch (e) {
    discount = [];
  }
  let categories = await getCategories(client);
  let products = await getProducts(client);
  let locations = await getLocations(client);
  res.json({
    discount: discount !== undefined ? discount : [],
    categories,
    products,
    locations,
  });
});

router.post("/discount", async (req, res) => {
  try {
    const discountResponse = await insertClubRateDiscount(client);
    const discount = await getClubRateDiscount(client);
    delete discount.raw;
    res.json([discount]);
  } catch (ex) {
    res.sendStatus(500);
  }
});

router.delete("/discount", async (req, res) => {
  try {
    const discount = await deleteClubRateDiscount(client);
    res.json({ success: true });
  } catch (ex) {
    res.sendStatus(500);
  }
});

router.get("/orders", async (req, res) => {
  try {
    const locations = await getLocations(client);
    if (!locations || locations.length === 0) {
      res.sendStatus(404);
      return;
    }
    const locationIds = locations.map((l) => l.id!);
    const orders = await getOrdersForLocations(client, locationIds);
    res.json(orders);
  } catch (ex) {
    res.sendStatus(500);
  }
});

export default router;
