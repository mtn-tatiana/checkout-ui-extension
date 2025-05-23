import type {
  RunInput,
  FunctionRunResult,
} from "../generated/api";
import {
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

type CartLine = {
  merchandise: {
    id: string;
    product: {
      id: string;
      inAnyCollection: boolean;
    };
  };
  quantity: number;
  cost: {
    amountPerQuantity: {
      amount: number;
    };
  };
};

export function run(input: RunInput): FunctionRunResult {
  let returnDiscounts: FunctionRunResult["discounts"] = [];
  let productsCount:number = 0;
  let discountCount:number = 0;
  let discountedItemPrice:number = 0;
  let discountedVariant: string | null = null;
  (input.cart.lines as CartLine[]).forEach((line) => {
    const variant = line.merchandise;
    if (variant.product.inAnyCollection) {
      productsCount += line.quantity;
    }
    if (variant.product.id === 'gid://shopify/Product/9413547295008') {
      discountedVariant = variant.id;
      discountedItemPrice = line.cost.amountPerQuantity.amount;
    }
  })
  if(productsCount >= 2 && discountedVariant) {
    discountCount = Math.floor(productsCount / 2);
    const variantPrice = discountedItemPrice * discountCount;
    returnDiscounts.push(
      {
        targets: [
          {
            productVariant: {
              id: discountedVariant
            }
          }
        ],
        message: 'Buy X get Y',
        value: {
          fixedAmount: {
            amount: variantPrice
          }
        }
      }
    )
  }
  if (returnDiscounts.length) {
    return {
      discounts: returnDiscounts,
      discountApplicationStrategy: DiscountApplicationStrategy.All
    }
  } else {
    console.error("The PRO discount is not applied to any cart line or the customer doesn't have a PRO tag.");
    return EMPTY_DISCOUNT;
  }
};
