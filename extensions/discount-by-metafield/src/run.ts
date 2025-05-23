import type {
  FunctionRunResult,
 Discount
} from "../generated/api";
import {
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input:any) {
  const discounts: Discount[] = [];

  input.cart.lines.forEach((line:any) => {
      const variant = line.merchandise;
      const linePrice = line.cost.amountPerQuantity.amount;

      if(variant.metafield && variant.metafield.value) {
          const variantPrice: number = linePrice - (+variant.metafield.value);

          discounts.push({
              targets: [
                  {
                      productVariant: {
                          id: variant.id,
                      },
                  },
              ],
              message: "Fixed Price",
              value: {
                  fixedAmount: {
                      amount: variantPrice,
                      appliesToEachItem: true,
                  },
              },
          });
      }
  });


  if (discounts.length) {
   return {
      discounts,
      discountApplicationStrategy: DiscountApplicationStrategy.First
    }
  } else {
    console.error("The PRO discount is not applied to any cart line or the customer doesn't have a PRO tag.");
    return EMPTY_DISCOUNT;
  }
}

