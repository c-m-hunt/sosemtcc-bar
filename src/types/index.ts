import { CatalogObject } from "square";

export interface CoreResponse {
  discount: ClubDiscount[];
  categories: Category[];
  products: Product[];
  locations: Location[];
}

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

export interface Money {
  currencyCode: string;
  amount: number;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: Money;
}

export interface Product {
  id: string;
  name: string;
  category: Category | null;
  variations: ProductVariation[];
}

export interface Location {
  id: string;
  name: string;
}

export interface OrderLine {
  variantId: string;
  variationName: string;
  name: string;
  quantity: number | string;
  price: Money;
  total: Money;
  product: Product;
}

export interface Card {
  brand: string;
  lastFour: string;
  method?: string;
}

export interface Tender {
  id: string;
  amount: Money;
  processingFee: Money;
  card?: Card;
  type?: string;
}

export interface Order {
  id: string;
  location?: Location;
  lines: OrderLine[];
  date?: Date;
  total: Money;
  tenders: Tender[];
}
