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

export interface Price {
  currencyCode: string;
  amount: number;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: Price;
}

export interface Product {
  id: string;
  name: string;
  category: Category | null;
  variations: ProductVariation[];
}

export interface CoreResponse {
  discount: ClubDiscount[];
  categories: Category[];
  products: Product[];
}
