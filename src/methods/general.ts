import {
  ApiResponse,
  BatchDeleteCatalogObjectsRequest,
  BatchDeleteCatalogObjectsResponse,
  Client,
  ListCatalogResponse,
  ListLocationsResponse,
  Location,
  SearchOrdersResponse,
} from "square";

export const getItems = async (
  client: Client
): Promise<ApiResponse<ListCatalogResponse>> => {
  const catalogApi = client.catalogApi;
  const items = await catalogApi.listCatalog();
  return items;
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

export const getOrdersForLocations = async (
  client: Client,
  locationIds: string[]
): Promise<ApiResponse<SearchOrdersResponse>> => {
  const ordersApi = client.ordersApi;
  const orders = await ordersApi.searchOrders({ locationIds });
  return orders;
};
