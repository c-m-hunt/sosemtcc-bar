import { BatchDeleteCatalogObjectsRequest, Client } from 'square'
import { v4 as uuidv4 } from 'uuid';

export const getItems = async (client: Client) => {
    const catalogApi = client.catalogApi;
    const items = await catalogApi.listCatalog();
    return items;
}

export const deleteInventoryItems = async (client: Client, ids: string[]) => {
    const catalogApi = client.catalogApi;
    const batchDeleteRequest: BatchDeleteCatalogObjectsRequest = {
        objectIds: ids
    }
    const response = await catalogApi.batchDeleteCatalogObjects(batchDeleteRequest);
    return response;
}

