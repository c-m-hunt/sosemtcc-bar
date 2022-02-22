export * from "./serverTypes";

export interface Config {
  apiBaseUrl: string;
  clubDiscount: {
    categoryNames: string[];
    discount: number;
  };
}
