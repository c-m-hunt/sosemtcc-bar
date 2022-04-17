import {
  CatalogItem,
  CatalogObject,
  Location as SqLocation,
  Money as SqMoney,
  Order as SqOrder,
} from "square";
import { Category, Product, Location, Order, Money } from "../types";

import { getCategoryFromCategoryId, getProductFromVariantId } from "./utils";

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
          price: convertSQMoney(variation.itemVariationData?.priceMoney),
        }))
        .filter((variation) => variation) || [],
  };
};

export const formatLocation = (location: SqLocation): Location => ({
  id: location.id!,
  name: location.name!,
});

export const convertSQMoney = (moneyIn: SqMoney | undefined): Money => {
  if (!moneyIn) {
    return { currencyCode: "GBP", amount: 0 };
  }
  return {
    currencyCode: moneyIn.currency || "",
    amount: Number(moneyIn.amount) / 100 || 0,
  };
};

export const formatOrder = (
  order: SqOrder,
  products: Product[],
  categories: Category[],
  locations: Location[]
): Order => {
  const orderOut: Order = {
    id: order.id!,
    location:
      locations.find((location) => location.id === order.locationId!) ||
      undefined,
    date: order.createdAt ? new Date(order.createdAt) : undefined,
    lines: [],
    total: convertSQMoney(order.netAmounts!.totalMoney),
    tenders: [],
  };

  if (order.tenders) {
    orderOut.tenders = order.tenders!.map((tender) => {
      return {
        id: tender.id!,
        amount: convertSQMoney(tender.amountMoney!),
        processingFee: convertSQMoney(tender.processingFeeMoney!),
        card: tender.cardDetails
          ? {
              brand: tender.cardDetails.card?.cardBrand!,
              lastFour: tender.cardDetails.card?.last4!,
              method: tender.cardDetails.entryMethod,
            }
          : undefined,
        type: tender.type!,
      };
    });
  }

  orderOut.lines = order.lineItems!.map((line) => {
    const product = getProductFromVariantId(products, line.catalogObjectId!);
    return {
      variantId: line.catalogObjectId!,
      variationName: line.variationName!,
      name: line.name!,
      quantity: line.quantity!,
      price: convertSQMoney(line.grossSalesMoney!),
      total: convertSQMoney(line.totalMoney!),
      product: product!,
    };
  });

  return orderOut as Order;
};
