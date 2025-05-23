import type {
  RunInput,
  FunctionRunResult
} from "../generated/api";


export function run(input: RunInput): FunctionRunResult {
  const totalPrice:number = input.cart.cost.totalAmount.amount;
  const option = input.cart.deliveryGroups[0].deliveryOptions.pop();

  if (!option) {
    return { discounts: [] };
  }

  if (totalPrice > 100 && totalPrice <= 300) {
    return {
      discounts: [
        {
          targets: [
            {
              deliveryOption: {
                handle: option?.handle
              }
            }
          ],
          value: {
            percentage: {
              value: 50.0,
            },
          },
        }
      ]
    };
  } else if (totalPrice > 300) {
    return {
      discounts: [
        {
          targets: [
            {
              deliveryOption: {
                handle: option?.handle
              }
            }
          ],
          value: {
            percentage: {
              value: 100.0,
            },
          },
        }
      ]
    };
  } else {
    return {
      discounts: [],
    };
  }
}
