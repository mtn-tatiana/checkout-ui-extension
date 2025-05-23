import type {
  RunInput,
  FunctionRunResult,
  CartLine,
  Target,
  ProductVariant
} from "../generated/api";
import {
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input: RunInput): FunctionRunResult {
  let returnDiscounts: Target[] = [];

    (input.cart.lines as CartLine[]).forEach((line: CartLine) => {
      const variant = line.merchandise as ProductVariant;
      if (variant && variant.id === 'gid://shopify/ProductVariant/49562943193376') {
        returnDiscounts.push({
          productVariant: {
            id: variant.id,
          },
        });
      }
    });

    if (returnDiscounts.length) {
        return {
          discounts: [
            {
              targets: returnDiscounts,
              message: 'PRODUCT50',
              value: {
                percentage: {
                  value: 50.0,
                },
              },
            },
          ],
          discountApplicationStrategy: DiscountApplicationStrategy.First,
        };
    } else {
      return EMPTY_DISCOUNT;
    }
}
