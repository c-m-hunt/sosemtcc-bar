#!/usr/bin/env ts-node

import { Client, Environment } from "square";
import { program } from "commander";
import kleur from "kleur";

import {
  insertClubRateDiscount,
  deleteClubRateDiscount,
} from "./methods/discounts";

require("dotenv").config();

const client = new Client({
  environment: process.env.SQUARE_ENV as Environment,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

program
  .name("sosemtcc-bar")
  .description("Bar tools for the cricket club")
  .version("0.0.1");

program
  .command("add-discount")
  .description("Add a club rate discount")
  .action(async () => {
    try {
      await insertClubRateDiscount(client);
      console.log(kleur.green("Club rate discount added"));
    } catch (error) {
      console.error(kleur.red((error as Error).message));
    }
  });

program
  .command("delete-discount")
  .description("Delete a club rate discount")
  .action(async () => {
    try {
      await deleteClubRateDiscount(client);
      console.log(kleur.green("Club rate discount deleted"));
    } catch (error) {
      console.error(kleur.red((error as Error).message));
    }
  });

program.parse();
