import { Category, ClubDiscount, Location, Product } from ".";

export interface CoreResponse {
  discount: ClubDiscount[];
  categories: Category[];
  products: Product[];
  locations: Location[];
}
