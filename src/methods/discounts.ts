import {
  Client,
  CatalogObject,
  CatalogObjectBatch,
  BatchUpsertCatalogObjectsRequest,
} from "square";
import { v4 as uuidv4 } from "uuid";
import { deleteInventoryItems } from "./general";

const clubDiscountName = "Club Discount";

export const getClubRateDiscount = async (client: Client) => {
  const catalogApi = client.catalogApi;
  const items = await catalogApi.listCatalog();
  const discount = items.result.objects?.filter(
    (item) => item.discountData?.name === clubDiscountName
  );
  if (!discount || discount.length === 0) {
    throw Error("No club discount found");
  }
  const pricingRule = items.result.objects?.filter((item) => {
    return (
      item.type === "PRICING_RULE" &&
      item.pricingRuleData?.discountId === discount[0].id
    );
  });
  if (!pricingRule || pricingRule.length === 0) {
    throw Error("No pricing rule found");
  }
  const productSet = items.result.objects?.filter((item) => {
    return (
      item.type === "PRODUCT_SET" &&
      item.id === pricingRule[0].pricingRuleData?.matchProductsId
    );
  });
  if (!productSet || productSet.length === 0) {
    throw Error("No product set found");
  }
  return [discount[0], pricingRule[0], productSet[0]];
};

export const deleteClubRateDiscount = async (client: Client) => {
  const catalogApi = client.catalogApi;
  const items = await catalogApi.listCatalog();
  const existingDiscount = await getClubRateDiscount(client);
  return await deleteInventoryItems(
    client,
    existingDiscount.map((item) => item.id)
  );
};

export const insertClubRateDiscount = async (client: Client) => {
  let existingDiscount;
  try {
    existingDiscount = await getClubRateDiscount(client);
  } catch (error) {}
  if (existingDiscount) {
    throw Error("Club discount already exists");
  }

  const discountsApi = client.catalogApi;
  const productSet: CatalogObject = {
    type: "PRODUCT_SET",
    id: "#ProductSet",
    isDeleted: false,
    presentAtAllLocations: true,
    productSetData: { allProducts: true },
  };

  const discount: CatalogObject = {
    type: "DISCOUNT",
    id: "#ClubRateDiscount",
    isDeleted: false,
    presentAtAllLocations: true,
    discountData: {
      name: clubDiscountName,
      discountType: "FIXED_PERCENTAGE",
      percentage: "15.0",
      modifyTaxBasis: "MODIFY_TAX_BASIS",
    },
  };

  const pricingRule: CatalogObject = {
    type: "PRICING_RULE",
    id: "#PricingRule",
    isDeleted: false,
    presentAtAllLocations: true,
    pricingRuleData: {
      discountId: discount.id,
      matchProductsId: productSet.id,
    },
  };

  const batchUpsertRequest: BatchUpsertCatalogObjectsRequest = {
    idempotencyKey: uuidv4(),
    batches: [{ objects: [productSet, discount, pricingRule] }],
  };

  const response = await discountsApi.batchUpsertCatalogObjects(
    batchUpsertRequest
  );
  console.log(response);
  return response;
};
