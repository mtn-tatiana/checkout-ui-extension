import type {
  RunInput,
  FunctionRunResult,
  ExpandedItem,
  CartOperation,
  CartLine,
  ProductVariant
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

interface CartLineWithMetafields extends CartLine {
  bundleProducts?: { value?: string };
  bundlePrice?: { value?: string };
  bundleQty?: { value?: string };
  noImage?: { value?: string };
  bundleId?: { value?: string };
}

export function run(input: RunInput): FunctionRunResult {
  const cartItems = input.cart.lines;
  const operationsList:CartOperation[] = [];

  (cartItems as CartLineWithMetafields[]).forEach((item) => {
    const variant = item.merchandise as ProductVariant;
    const bundleId = item.bundleId;
    if(item.bundleProducts?.value) {
      const productsList = item.bundleProducts?.value.split('|');
      const cartLineId = item.id;
      const bundlePrice = item.bundlePrice?.value ? item.bundlePrice.value : '';
      const bundleQty = item.bundleQty?.value ? Number(item.bundleQty.value) : 0;
      const expandedItems:ExpandedItem[] = [];

      if(productsList.length && bundlePrice && bundleQty) {
        productsList?.forEach((id) => {
          if (id.trim().length > 0) {
            expandedItems.push({
              "merchandiseId": `gid://shopify/ProductVariant/${id.trim()}`,
              "quantity": bundleQty,
              "price": {
                "adjustment": {
                  "fixedPricePerUnit": {
                    "amount": bundlePrice
                  }
                }
              }
            })
          }
        })
        if (expandedItems.length > 0) {
          operationsList.push({
            'expand': {
              cartLineId: cartLineId,
              expandedCartItems: expandedItems
            }
          })
        }
      }
    }

    const noImage:string = item.noImage?.value ? item.noImage?.value : '';
    if(noImage === 'true' && variant.id !== bundleId) {
      operationsList.push({
        "update": {
          "cartLineId": item.id,
          "title": "Updated Image",
          "image": {
            "url": "https://cdn.shopify.com/s/files/1/0723/1075/1520/files/cory.jpg?v=1727185563"
          },
          "price": {
            "adjustment": {
              "fixedPricePerUnit": {
                "amount": "20"
              }
            }
          }
        }
      })
    }
  })

  if (operationsList.length > 0) {
    return {
      operations: operationsList
    }
  } else {
    return NO_CHANGES;
  }
}
