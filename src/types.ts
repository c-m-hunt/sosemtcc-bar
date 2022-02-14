import { CatalogObject } from "square";

export interface ClubDiscount {
  name: string;
  discountType: string;
  percentage: number;
  allProducts: boolean;
  categoryNames?: string[];
}

export interface ClubDiscountWithRaw extends ClubDiscount {
  raw?: {
    discount: CatalogObject;
    pricingRule: CatalogObject;
    productSet: CatalogObject;
    categories?: CatalogObject[];
  };
}

export interface Category {
  name: string;
  id: string;
}

export interface CoreResponse {
  discount: ClubDiscount[];
  categories: Category[];
}
