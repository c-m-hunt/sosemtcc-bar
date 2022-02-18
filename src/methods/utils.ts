import { Product, Category } from "../types";

export const getProductFromVariantId = (
  products: Product[],
  variantId: string
) => {
  for (const product of products) {
    for (const variation of product.variations) {
      if (variation.id === variantId) {
        return product;
      }
    }
  }
  return undefined;
};

export const getCategoryFromCategoryId = (
  categories: Category[],
  categoryId: string
) => {
  for (const category of categories) {
    if (category.id === categoryId) {
      return category;
    }
  }
  return undefined;
};
