import type {
  RunInput,
  FunctionRunResult,
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: RunInput): FunctionRunResult {
  if(input.cart.lines.length === 0)  return NO_CHANGES;

  const gifts:string[] = ['gid://shopify/ProductVariant/48596688273696','gid://shopify/ProductVariant/48596684341536','gid://shopify/ProductVariant/48596679786784'];
  const lineId:string = input.cart.lines[0].id;
  const lineCost:number = input.cart.lines[0].cost.totalAmount.amount
  const ordersCount:number = input.cart.buyerIdentity?.customer?.numberOfOrders ? input.cart.buyerIdentity?.customer?.numberOfOrders : 0;

  if (ordersCount >= 1 && ordersCount <= gifts.length) {
    const gift = gifts[ordersCount - 1];
    return {
      operations: [
        {
          expand: {
            cartLineId: lineId,
            expandedCartItems: [
              {
                merchandiseId: gift,
                quantity: 1,
                price: {
                  adjustment: {
                    fixedPricePerUnit: {
                      amount: lineCost
                    }
                  }
                }
              }
            ]
          }
        }
      ]
    };
  } else {
    return NO_CHANGES;
  }
}
