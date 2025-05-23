import { describe, it, expect } from 'vitest';
import { run } from './run';
import { FunctionRunResult, CartLine } from '../generated/api';

describe('cart transform function', () => {
  it('returns no operations', () => {
    const result = run({
      cart: {
        lines: []
      }
    });
    const expected: FunctionRunResult = { operations: [] };

    expect(result).toEqual(expected);
  });

  it('creates one expand operation for a bundle with two products', () => {
    const result = run({
      cart: {
        lines: [
          {
            bundleId: {
              value: "some-id"
            },
            bundlePrice: {
              value: "150"
            },
            bundleProducts: {
              value: "111 | 222"
            },
            bundleQty: {
              value: "2"
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "some-id"
            },
            noImage: null,
            id: "line-1",
            quantity: 1,
            cost: {
              amountPerQuantity: {
                amount: 200
              }
            }
          },
        ]
      }
    });

    const expected: FunctionRunResult = {
      operations: [
        {
          'expand': {
            cartLineId: "line-1",
            expandedCartItems: [
              {
                "merchandiseId": `gid://shopify/ProductVariant/111`,
                "quantity": 2,
                "price": {
                  "adjustment": {
                    "fixedPricePerUnit": {
                      "amount": "150"
                    }
                  }
                }
              },
              {
                "merchandiseId": `gid://shopify/ProductVariant/222`,
                "quantity": 2,
                "price": {
                  "adjustment": {
                    "fixedPricePerUnit": {
                      "amount": "150"
                    }
                  }
                }
              }
            ]
          }
        }
      ],
    }
    expect(result).toEqual(expected);
    expect(result.operations.length).toBe(1);
    expect(result.operations[0]).toHaveProperty('expand');
    expect(result.operations[0].expand?.cartLineId).toBe('line-1');
  });

  it('change image for bundle', () => {
    const result = run({
      cart: {
        lines: [
          {
            bundleId: {
              value: "some-id"
            },
            bundlePrice: {
              value: "150"
            },
            bundleProducts: {
              value: "111|"
            },
            bundleQty: {
              value: "1"
            },
            noImage: {
              value: null
            },
            id: "line-1",
            quantity: 1,
            cost: {
              amountPerQuantity: {
                amount: 200
              }
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "some-id"
            }
          },
          {
            noImage: {
              value: "true"
            },
            id: "line-2",
            quantity: 1,
            cost: {
              amountPerQuantity: {
                amount: 150
              }
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "some-id-2"
            }
          }
        ]
      }
    });

    const expected: FunctionRunResult = {
      operations: [
        {
          expand: {
            cartLineId: "line-1",
            expandedCartItems: [
              {
                merchandiseId: "gid://shopify/ProductVariant/111",
                quantity: 1,
                price: {
                  adjustment: {
                    fixedPricePerUnit: {
                      amount: "150"
                    }
                  }
                }
              }
            ]
          }
        },
        {
          update: {
            cartLineId: "line-2",
            title: "Updated Image",
            image: {
              url: "https://cdn.shopify.com/s/files/1/0723/1075/1520/files/cory.jpg?v=1727185563"
            },
            price: {
              adjustment: {
                fixedPricePerUnit: {
                  amount: "20"
                }
              }
            }
          }
        }
      ],
    }
    expect(result).toEqual(expected);
    expect(result.operations[0]).toHaveProperty('expand');
    const updateOp = result.operations.find(op => 'update' in op);

    expect(updateOp).toBeDefined();
  });

  it('ignores empty or whitespace-only bundleProducts string', () => {
    const result = run({
      cart: {
        lines: [
          {
            id: 'line-empty-bundle',
            quantity: 1,
            cost: {
              amountPerQuantity: {
                amount: 200
              }
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "some-id"
            },
            bundleProducts: {
              value: '   '
            },
            bundlePrice: {
              value: '10'
            },
            bundleQty: {
              value: '1'
            },
            noImage: null,
          },
        ],
      },
    });

    expect(result).toEqual({ operations: [] });
  });

});
