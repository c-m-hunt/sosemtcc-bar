import {
  ApiResponse,
  BatchDeleteCatalogObjectsRequest,
  BatchDeleteCatalogObjectsResponse,
  CatalogObject,
  Client,
  ListCatalogResponse,
  SearchOrdersResponse,
} from "square";

import { Location, Category, Product, Order } from "../types";

import {
  squareCache,
  ALL_ITEMS_CACHE_KEY,
  ALL_LOCATIONS_CACHE_KEY,
  ORDERS_FOR_LOCATION_CACHE_KEY,
} from "./cache";
import {
  formatLocation,
  formatCategory,
  formatProduct,
  formatOrder,
} from "./format";

export const getItems = async (client: Client): Promise<CatalogObject[]> => {
  const cached =
    squareCache.get<ApiResponse<ListCatalogResponse>>(ALL_ITEMS_CACHE_KEY);
  if (cached) {
    return cached.result.objects || [];
  }
  const catalogApi = client.catalogApi;
  const items = await catalogApi.listCatalog();
  squareCache.set(ALL_ITEMS_CACHE_KEY, items);
  return items.result.objects || [];
};

export const deleteInventoryItems = async (
  client: Client,
  ids: string[]
): Promise<ApiResponse<BatchDeleteCatalogObjectsResponse>> => {
  const catalogApi = client.catalogApi;
  const batchDeleteRequest: BatchDeleteCatalogObjectsRequest = {
    objectIds: ids,
  };
  const response = await catalogApi.batchDeleteCatalogObjects(
    batchDeleteRequest
  );
  return response;
};

export const getLocations = async (client: Client): Promise<Location[]> => {
  const cached = squareCache.get<Location[]>(ALL_LOCATIONS_CACHE_KEY);
  if (cached) {
    return cached;
  }
  const locationsApi = client.locationsApi;
  const locations = await locationsApi.listLocations();
  const locationsOut =
    locations.result.locations?.map((location) => formatLocation(location)) ||
    [];
  squareCache.set(ALL_LOCATIONS_CACHE_KEY, locationsOut, 600);
  return locationsOut;
};

export const getItemsByType = async (
  client: Client,
  type: string
): Promise<CatalogObject[]> => {
  const allItems = await getItems(client);
  if (!allItems) {
    return [];
  }
  const items = allItems.filter((item) => item.type === type);
  return items;
};

export const getCategories = async (client: Client): Promise<Category[]> => {
  const categories = await getItemsByType(client, "CATEGORY");
  return categories.map((category) => formatCategory(category));
};

export const getProducts = async (client: Client): Promise<Product[]> => {
  const products = await getItemsByType(client, "ITEM");
  const categories = await getCategories(client);
  return products.map((prod) => formatProduct(prod, categories));
};

export const getOrdersForLocations = async (
  client: Client,
  locationIds: string[]
): Promise<Order[]> => {
  const cacheKey = `${ORDERS_FOR_LOCATION_CACHE_KEY}_${locationIds.join(",")}`;
  const cached = squareCache.get<Order[]>(cacheKey);
  const products = await getProducts(client);
  const categories = await getCategories(client);
  const locations = await getLocations(client);
  if (cached) {
    return cached;
  }
  const ordersApi = client.ordersApi;
  const orders = await ordersApi.searchOrders({ locationIds });
  const ordersOut =
    orders.result.orders?.map((order) =>
      formatOrder(order, products, categories, locations)
    ) || [];
  squareCache.set(cacheKey, ordersOut, 60);
  return ordersOut;
};
