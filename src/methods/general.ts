import {
  ApiResponse,
  BatchDeleteCatalogObjectsRequest,
  BatchDeleteCatalogObjectsResponse,
  Client,
  ListCatalogResponse,
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
