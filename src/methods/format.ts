import { CatalogItem, CatalogObject } from "square";
import { Category, Product } from "../types";

export const formatCategory = (category: CatalogObject): Category => ({
  id: category.id,
  name: category.categoryData?.name || "",
});

export const formatProduct = (
  product: CatalogObject,
  categories: Category[]
): Product => {
  const categoryId = product.itemData?.categoryId;
  const category = categories.find((category) => category.id === categoryId);
  return {
    id: product.id,
    name: product.itemData?.name || "",
    category: category || null,
    variations:
      product.itemData?.variations
        ?.map((variation) => ({
          id: variation.id,
          name: variation.itemVariationData?.name || "",
          price: {
            currencyCode:
              variation.itemVariationData?.priceMoney?.currency || "",
            amount:
              Number(variation.itemVariationData?.priceMoney?.amount) / 100 ||
              0,
          },
        }))
        .filter((variation) => variation) || [],
  };
};
