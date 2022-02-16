import NodeCache from "node-cache";

export const squareCache = new NodeCache({ stdTTL: 120 });

export const ALL_ITEMS_CACHE_KEY = "ALL_ITEMS";
export const ALL_LOCATIONS_CACHE_KEY = "ALL_LOCATIONS";
export const ORDERS_FOR_LOCATION_CACHE_KEY = "ORDERS_FOR_LOCATION";
