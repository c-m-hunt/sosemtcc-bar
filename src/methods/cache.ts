import NodeCache from "node-cache";

export const squareCache = new NodeCache({ stdTTL: 120 });

export const ALL_ITEMS_CACHE_KEY = "ALL_ITEMS";
