import {
  ApiResponse,
  BatchDeleteCatalogObjectsRequest,
  BatchDeleteCatalogObjectsResponse,
  CatalogObject,
  Client,
  ListCatalogResponse,
  ListLocationsResponse,
  Location,
  SearchOrdersResponse,
} from "square";

import { squareCache, ALL_ITEMS_CACHE_KEY } from "./cache";

export const getItems = async (client: Client): Promise<CatalogObject[]> => {
  const cached =
    squareCache.get<ApiResponse<ListCatalogResponse>>(ALL_ITEMS_CACHE_KEY);
  if (cached) {
    console.log("Returning CACHED output");
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

export const getLocations = async (
  client: Client
): Promise<ApiResponse<ListLocationsResponse>> => {
  const locationsApi = client.locationsApi;
  const locations = await locationsApi.listLocations();
  return locations;
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

export const getCategories = async (
  client: Client
): Promise<CatalogObject[]> => {
  return await getItemsByType(client, "CATEGORY");
};

export const getProducts = async (client: Client): Promise<CatalogObject[]> => {
  return await getItemsByType(client, "ITEM");
};

export const getOrdersForLocations = async (
  client: Client,
  locationIds: string[]
): Promise<ApiResponse<SearchOrdersResponse>> => {
  const ordersApi = client.ordersApi;
  const orders = await ordersApi.searchOrders({ locationIds });
  return orders;
};
