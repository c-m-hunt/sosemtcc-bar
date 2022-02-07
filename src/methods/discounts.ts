import {
  Client,
  CatalogObject,
  BatchUpsertCatalogObjectsRequest,
} from "square";
import { v4 as uuidv4 } from "uuid";
import { deleteInventoryItems } from "./general";
import { config } from "../config";
import { ClubDiscountWithRaw } from "../types";

const clubDiscountName = "Club rate";

export const getClubRateDiscount = async (
  client: Client
): Promise<ClubDiscountWithRaw> => {
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

  const categories = items.result.objects?.filter((item) =>
    productSet[0].productSetData?.productIdsAny!.includes(item.id)
  );

  return {
    name: clubDiscountName,
    discountType: discount[0].discountData?.discountType!,
    percentage: parseFloat(discount[0].discountData?.percentage!),
    allProducts: productSet[0].productSetData?.allProducts!,
    categoryNames: categories?.map((category) => category.categoryData?.name!),
    raw: {
      discount: discount[0],
      pricingRule: pricingRule[0],
      productSet: productSet[0],
      categories,
    },
  };
};

export const deleteClubRateDiscount = async (client: Client) => {
  const catalogApi = client.catalogApi;
  const items = await catalogApi.listCatalog();
  const existingDiscount = await getClubRateDiscount(client);
  if (existingDiscount && existingDiscount.raw) {
    return await deleteInventoryItems(client, [
      existingDiscount.raw.discount.id,
      existingDiscount.raw.pricingRule.id,
      existingDiscount.raw.productSet.id,
    ]);
  }
};

export const getClubDiscountCategories = async (client: Client) => {
  const catalogApi = client.catalogApi;
  const items = await catalogApi.listCatalog();
  return items.result.objects?.filter(
    (item) =>
      item.type === "CATEGORY" &&
      config.clubDiscountCategories.includes(item.categoryData?.name || "")
  );
};

export const insertClubRateDiscount = async (client: Client) => {
  let existingDiscount;
  try {
    existingDiscount = await getClubRateDiscount(client);
  } catch (error) {
    console.debug("No club discount found");
  }
  if (existingDiscount) {
    throw Error("Club discount already exists");
  }
  const categories = await getClubDiscountCategories(client);

  const discountsApi = client.catalogApi;
  const productSet: CatalogObject = {
    type: "PRODUCT_SET",
    id: "#ProductSet",
    isDeleted: false,
    presentAtAllLocations: true,
    productSetData: {
      allProducts: false,
      productIdsAny: categories?.map((category) => category.id) || [],
    },
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
  return response;
};
