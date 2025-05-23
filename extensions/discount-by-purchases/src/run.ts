import type {
  RunInput,
  FunctionRunResult
} from "../generated/api";
import {
  DiscountApplicationStrategy,
} from "../generated/api";


const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input: RunInput): FunctionRunResult {
  let totalPrice:number = input.cart.cost.totalAmount.amount;

  if (totalPrice > 100) {
    return {
      discounts: [
        {
          targets: [
            {
              orderSubtotal: {
                excludedVariantIds: [],
              },
            },
          ],
          value: {
            percentage: {
              value: "3.0",
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
