import express from "express";
import { Client, Environment } from "square";
import { deleteClubRateDiscount, getClubRateDiscount, insertClubRateDiscount } from "../methods/discounts";
import { getLocations, getOrdersForLocations } from "../methods/general";

const client = new Client({
  environment: process.env.SQUARE_ENV as Environment,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const router = express.Router();

BigInt.prototype.toJSON = function() { return this.toString() }

router.get("/discount", async (req, res) => {
  try {
    const discount = await getClubRateDiscount(client);
    delete discount.raw;
    res.json([discount]);
  } catch (ex) {
    res.json([]);
  }
});

router.post("/discount", async (req, res) => {
  try {
    const discountResponse = await insertClubRateDiscount(client);
    const discount = await getClubRateDiscount(client);
    delete discount.raw;
    res.json([discount]);
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});

router.delete("/discount", async (req, res) => {
  try {
    const discount = await deleteClubRateDiscount(client);
    res.json({"success": true});
  } catch (ex) {
    res.sendStatus(500);
  }
});

router.get("/orders", async(req, res) => {
  try {
    const locationRes = await getLocations(client);
    const locations = locationRes.result.locations;
    if (!locations || locations.length === 0) {
      res.sendStatus(404);
      return;
    }
    const locationIds = locations.map(l => l.id!)
    const orders = await getOrdersForLocations(client, locationIds);
    res.json(orders.result.orders);
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});


export default router;
