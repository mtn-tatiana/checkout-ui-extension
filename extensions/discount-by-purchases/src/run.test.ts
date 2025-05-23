import { describe, it, expect } from 'vitest';
import { run } from './index';
import { DiscountApplicationStrategy, CurrencyCode, FunctionRunResult} from '../generated/api';

describe('order discounts function', () => {
  it('returns no discounts if total under 100', () => {
    const result = run({
      cart: {
        cost: {
          totalAmount: {
            amount: 50,
            currencyCode: "USD" as CurrencyCode
          }
        }
      }
    });

    const expected: FunctionRunResult = {
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts: [],
    };

    expect(result).toEqual(expected);
  });

  it('returns no discounts if total over 100', () => {
    const result = run({
      cart: {
        cost: {
          totalAmount: {
            amount: 200,
            currencyCode: "USD" as CurrencyCode
          }
        }
      }
    });

    const expected: FunctionRunResult = {
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

    expect(result).toEqual(expected);
  });
});
