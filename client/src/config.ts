import { Config } from "./types";

export const config: Config = {
  apiBaseUrl: "http://localhost:3030/api",
  clubDiscount: {
    categoryNames: [
      "Lager",
      "Cider",
      "Ales/Bitters",
      "Spirits",
      "Liqueurs",
      "Wine",
    ],
    discount: 15,
  },
};
