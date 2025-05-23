import { describe, it, expect } from 'vitest';
import { run } from './run';
import { FunctionRunResult } from '../generated/api';

describe('order function', () => {
  it('returns no operations', () => {
    const result = run({
      cart: {
        buyerIdentity: {
          customer: {
            email: null,
            numberOfOrders: 0
          }
        },
        lines: [
          {
            id: "line-1",
            quantity: 1,
            cost: {
              totalAmount: {
                amount: 100.00
              }
            }
          }
        ]
      }
    });
    const expected: FunctionRunResult = { operations: [] };

    expect(result).toEqual(expected);
  });

  it('order count 1', () => {
    const result = run({
      cart: {
        buyerIdentity: {
          customer: {
            email: "test@mtnhausdigital.com",
            numberOfOrders: 1
          }
        },
        lines: [
          {
            id: "line-1",
            quantity: 1,
            cost: {
              totalAmount: {
                amount: 100.00
              }
            }
          },
          {
            id: "line-2",
            quantity: 2,
            cost: {
              totalAmount: {
                amount: 99.00
              }
            }
          }
        ]
      }
    });
    const expected: FunctionRunResult = {  operations: [
        {
          'expand': {
            cartLineId: "line-1",
            expandedCartItems: [
              {
                "merchandiseId": "gid://shopify/ProductVariant/48596688273696",
                "quantity": 1,
                "price": {
                  "adjustment": {
                    "fixedPricePerUnit": {
                      "amount": 100.00
                    }
                  }
                }
              },
            ]
          }
        }
      ] };

    expect(result).toEqual(expected);
  });

  it('order count 2', () => {
    const result = run({
      cart: {
        buyerIdentity: {
          customer: {
            email: "test@mtnhausdigital.com",
            numberOfOrders: 2
          }
        },
        lines: [
          {
            id: "line-1",
            quantity: 1,
            cost: {
              totalAmount: {
                amount: 100.00
              }
            }
          }
        ]
      }
    });
    const expected: FunctionRunResult = {  operations: [
        {
          'expand': {
            cartLineId: "line-1",
            expandedCartItems: [
              {
                "merchandiseId": "gid://shopify/ProductVariant/48596684341536",
                "quantity": 1,
                "price": {
                  "adjustment": {
                    "fixedPricePerUnit": {
                      "amount": 100.00
                    }
                  }
                }
              },
            ]
          }
        }
      ] };

    expect(result).toEqual(expected);
  });

  it('order count 3', () => {
    const result = run({
      cart: {
        buyerIdentity: {
          customer: {
            email: "test@mtnhausdigital.com",
            numberOfOrders: 3
          }
        },
        lines: [
          {
            id: "line-1",
            quantity: 1,
            cost: {
              totalAmount: {
                amount: 100.00
              }
            }
          }
        ]
      }
    });
    const expected: FunctionRunResult = {  operations: [
        {
          'expand': {
            cartLineId: "line-1",
            expandedCartItems: [
              {
                "merchandiseId": "gid://shopify/ProductVariant/48596679786784",
                "quantity": 1,
                "price": {
                  "adjustment": {
                    "fixedPricePerUnit": {
                      "amount": 100.00
                    }
                  }
                }
              },
            ]
          }
        }
      ]};

    expect(result).toEqual(expected);
  });

    it('line items count 0', () => {
        const result = run({
            cart: {
                buyerIdentity: {
                    customer: {
                        email: "test@mtnhausdigital.com",
                        numberOfOrders: 3
                    }
                },
                lines: []
            }
        });
        const expected: FunctionRunResult = { operations: [] };

        expect(result).toEqual(expected);
    });

    it('line items count 10', () => {
        const result = run({
            cart: {
                buyerIdentity: {
                    customer: {
                        email: "test@mtnhausdigital.com",
                        numberOfOrders: 10
                    }
                },
                lines: []
            }
        });
        const expected: FunctionRunResult = { operations: [] };

        expect(result).toEqual(expected);
    });
});
