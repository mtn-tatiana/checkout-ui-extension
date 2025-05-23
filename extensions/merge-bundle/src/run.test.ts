import { describe, it, expect } from 'vitest';
import { run } from './run';
import type { FunctionRunResult } from '../generated/api';

describe('run()', () => {
  it('creates one merge operation for a bundle with two products', () => {
    const result = run({
      cart: {
        lines: [
          {
            id: 'line-1',
            quantity: 1,
            merchandise: { __typename: 'ProductVariant', id: 'some-id' },
            bundleId: { value: 'bundle-123' },
            bundleQty: { value: '1' },
          },
          {
            id: 'line-2',
            quantity: 1,
            merchandise: { __typename: 'ProductVariant', id: 'some-id-2' },
            bundleId: { value: 'bundle-123' },
            bundleQty: { value: '2' },
          },
        ],
      },
    });

    const expected: FunctionRunResult = {
      operations: [
        {
          merge: {
            cartLines: [
              {
                cartLineId: 'line-1',
                quantity: 1,
              },
              {
                cartLineId: 'line-2',
                quantity: 2,
              },
            ],
            parentVariantId: 'gid://shopify/ProductVariant/49562943193376',
            price: {
              percentageDecrease: {
                value: 10.0,
              },
            },
            image: {
              url: 'https://cdn.shopify.com/s/files/1/0723/1075/1520/files/cory.jpg?v=1727185563',
            },
            title: 'Bundle',
          },
        },
      ],
    }
    expect(result).toEqual(expected);
  });

  it('creates multiple merge operations for multiple distinct bundleIds', () => {
    const result = run({
      cart: {
        lines: [
          {
            id: 'line-1',
            quantity: 1,
            merchandise: { __typename: 'ProductVariant', id: 'some-id-1' },
            bundleId: { value: 'bundle-a' },
            bundleQty: { value: '1' },
          },
          {
            id: 'line-2',
            quantity: 1,
            merchandise: { __typename: 'ProductVariant', id: 'some-id-2' },
            bundleId: { value: 'bundle-b' },
            bundleQty: { value: '2' },
          },
          {
            id: 'line-3',
            quantity: 1,
            merchandise: { __typename: 'ProductVariant', id: 'some-id-3' },
            bundleId: { value: 'bundle-a' },
            bundleQty: { value: '1' },
          },
        ],
      },
    });

    expect(result.operations).toHaveLength(2);

    const bundles = result.operations.map(op =>
        op.merge?.cartLines.map(l => l.cartLineId).sort()
    );

    expect(bundles).toContainEqual(['line-1', 'line-3']);
    expect(bundles).toContainEqual(['line-2']);
  });

  it('returns NO_CHANGES if no cart lines have bundleId', () => {
    const result = run({
      cart: {
        lines: [
          {
            id: 'line-1',
            quantity: 1,
            merchandise: { __typename: 'ProductVariant', id: 'some-id' },
            bundleId: null,
            bundleQty: null,
          },
        ],
      },
    });
    expect(result).toEqual({
      operations: [],
    });
  });
});

