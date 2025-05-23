import type {
  RunInput,
  FunctionRunResult,
  CartOperation,
  CartLineInput
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: RunInput): FunctionRunResult {
 /* const cartItems = input.cart.lines;
  const operationsList:CartOperation[] = [];
  const idList:string[] = [];

  cartItems.forEach((item) => {
    if(item.bundleId?.value && !idList.includes(item.bundleId.value)) {
      idList.push(item.bundleId?.value )
    }
  })

  idList.forEach((id) => {
    const bundleCartLines:CartLineInput[] = [];
    const bundleProducts = cartItems.filter((item) => item.bundleId?.value === id);
    bundleProducts.forEach((bundleProduct) => {
      bundleCartLines.push({
        "cartLineId": bundleProduct.id,
        "quantity": Number(bundleProduct.bundleQty?.value)
      })
    })

    operationsList.push({
      merge: {
        cartLines: bundleCartLines,
        parentVariantId: "gid://shopify/ProductVariant/49562943193376",
        price: {
          percentageDecrease: {
            value: 10.0
          }
        },
        image: {
          url: "https://cdn.shopify.com/s/files/1/0723/1075/1520/files/cory.jpg?v=1727185563"
        },
        title: 'Bundle',
      }
    })
  })




  if(operationsList.length > 0) {
    return {
      operations: operationsList,
    }
  } else {
    return NO_CHANGES;
  }*/
  return NO_CHANGES;
}
