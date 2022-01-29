import { Client, Environment } from "square";

import { deleteInventoryItems, getItems } from "./methods/general";

import {
  insertClubRateDiscount,
  getClubRateDiscount,
  deleteClubRateDiscount,
} from "./methods/discounts";

require("dotenv").config();

const client = new Client({
  environment: process.env.SQUARE_ENV as Environment,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

// getItems(client).then(async (items) => {
//     if (items.result.objects) {
//         const filteredItems = items.result.objects.filter(item => ['DISCOUNT', 'PRODUCT_SET'].includes(item.type));
//         // const filteredItems = items.result.objects.filter(item => 1==1);
//         for (const obj of filteredItems) {
//             console.log(obj)
//         }
//         const response = await deleteInventoryItems(client, filteredItems.map(item => item.id));
//         console.log(response)
//     }
// });

insertClubRateDiscount(client).then((response) => {
  console.log(response);
  // response.result.objects?.map(obj => {
  //     console.log(obj)
  // })
});

// getClubRateDiscount(client).then(response => {
//     console.log(response)
// })
