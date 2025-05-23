import { describe, it, expect } from 'vitest';
import { run } from './run';
import { DiscountApplicationStrategy, FunctionRunResult } from '../generated/api';

describe('run()', () => {
  it('returns a fixed discount if variant has metafield', () => {
    const result = run({
      cart: {
        lines: [
          {
            merchandise: {
              id: 'gid://shopify/ProductVariant/123',
              metafield: {
                value: '5.00',
              },
            },
            cost: {
              amountPerQuantity: {
                amount: 20.0,
              },
            },
          },
        ],
      },
    });

    const expected: FunctionRunResult = {
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [
        {
          targets: [
            {
              productVariant: {
                id: 'gid://shopify/ProductVariant/123',
              },
            },
          ],
          message: 'Fixed Price',
          value: {
            fixedAmount: {
              amount: 15.0,
              appliesToEachItem: true,
            },
          },
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it('returns no discounts if no metafields', () => {
    const result = run({
      cart: {
        lines: [
          {
            merchandise: {
              id: 'gid://shopify/ProductVariant/456',
              metafield: null,
            },
            cost: {
              amountPerQuantity: {
                amount: 30.0,
              },
            },
          },
        ],
      },
    });

    const expected: FunctionRunResult = {
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [],
    };

    expect(result).toEqual(expected);
  });

  it('applies fixed discounts to multiple variants with metafields', () => {
    const result = run({
      cart: {
        lines: [
          {
            merchandise: {
              id: 'gid://shopify/ProductVariant/111',
              metafield: {
                value: '3.00',
              },
            },
            cost: {
              amountPerQuantity: {
                amount: 10.0,
              },
            },
          },
          {
            merchandise: {
              id: 'gid://shopify/ProductVariant/222',
              metafield: {
                value: '2.50',
              },
            },
            cost: {
              amountPerQuantity: {
                amount: 12.5,
              },
            },
          },
        ],
      },
    });

    const expected: FunctionRunResult = {
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [
        {
          targets: [
            {
              productVariant: {
                id: 'gid://shopify/ProductVariant/111',
              },
            },
          ],
          message: 'Fixed Price',
          value: {
            fixedAmount: {
              amount: 7.0,
              appliesToEachItem: true,
            },
          },
        },
        {
          targets: [
            {
              productVariant: {
                id: 'gid://shopify/ProductVariant/222',
              },
            },
          ],
          message: 'Fixed Price',
          value: {
            fixedAmount: {
              amount: 10.0,
              appliesToEachItem: true,
            },
          },
        },
      ],
    };

    expect(result).toEqual(expected);
  });
});
