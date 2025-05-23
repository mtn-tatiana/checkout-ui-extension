import React, {useEffect, useState} from "react";
import {
  reactExtension,
  BlockStack,
  Heading,
  InlineLayout,
  SkeletonImage,
  SkeletonText,
  Image,
  Text,
  Button,
  Banner,
  useApi,
  useCartLines,
  useApplyCartLinesChange,
  useSettings
} from "@shopify/ui-extensions-react/checkout";
import type { I18n } from '@shopify/ui-extensions/checkout';

export default reactExtension("purchase.checkout.block.render", () => (
    <Extension/>
));

interface ProductType {
  id: string;
  title: string;
  images: {
    nodes: { url: string }[];
  };
  variants: {
    nodes: {
      id: string;
      price: { amount: string };
    }[];
  };
}

interface CartLine {
  id: string,
  merchandise: {
    product: {
      id: string;
    }
  }
}

interface ProductOfferProps {
  product: ProductType;
  i18n: I18n;
  addLineItem: (id: string) => Promise<void>;
  adding: boolean;
  showError: boolean;
}

function Extension() {
  const {query, i18n} = useApi();
  const settings = useSettings<{ id_list?: string }>();
  const id_list = settings.id_list ?? '9275042529568, 9274985611552, 9274810827040, 9274963165472';
  const [products, setProducts] = useState<ProductType[]>([]);
  const idsList = id_list.split(',');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const applyCartLinesChange = useApplyCartLinesChange();
  const [showError, setShowError] = useState(false);
  const [adding, setAdding] = useState(false);
  const cartItems = useCartLines();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function addLineItem(id: string): Promise<void> {
    setAdding(true);
    const result = await applyCartLinesChange({
      type: 'addCartLine',
      merchandiseId: id,
      quantity: 1,
    });
    setAdding(false);

    if (result.type === 'error') {
      setShowError(true);
      console.error(result.message);
    }
  }

  async function fetchProducts() {
    setLoading(true);
    const ids = [...idsList.map(productId => `gid://shopify/Product/${productId.trim()}`)];
    try {
      const { data } = await query<{ nodes: ProductType[] }>(
          `query Products($ids: [ID!]!) {
        nodes(ids: $ids) {
        ... on Product {
          id
          title
          images (first: 1){
            nodes {
              url
            }
          },
          variants(first: 1) {
              nodes {
                id
                price {
                  amount
                }
              }
            }
          }
        }
      }`,
          {
            variables: {"ids": ids}
          }
      )

      if (data && data.nodes) {
        setProducts(data.nodes);
      }
    } catch (error) {
      setError(true)
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const productsList = getProductsList(cartItems, products);

  if (loading && productsList.length > 0) {
    return <LoadingOffer/>;
  }

  if (error) {
    return <ErrorBanner/>;
  }

  if (productsList.length === 0) {
    return <EmptyOffer />
  }

  return (
      <ProductOffer
          product={productsList[0]}
          i18n={i18n}
          addLineItem={addLineItem}
          adding={adding}
          showError={showError}
      />
  );
}

function getProductsList(cartItems: CartLine[], products: ProductType[]): ProductType[]  {
  const cartLineProductIds = cartItems.map((item) => item.merchandise.product.id);
  return products.filter((product:ProductType) => {
    return !cartLineProductIds.includes(product.id);
  });
}

function ProductOffer({product, i18n, addLineItem, adding, showError}:ProductOfferProps) {
  const {images, title, variants} = product;
  const imgUrl = images.nodes[0]?.url;
  const renderPrice = i18n.formatCurrency(Number(variants.nodes[0].price.amount));
  return (
      <BlockStack>
        <Heading level={2}>You might also like</Heading>
        <InlineLayout padding={['base', 'none', 'none', 'none']} spacing="base" columns={[64, 'fill', 64]}>
          <Image source={imgUrl}/>
          <BlockStack>
            <Text size="base" emphasis="bold">{title}</Text>
            <Text size="medium">{renderPrice}</Text>
          </BlockStack>
          <Button loading={adding} onPress={() => addLineItem(variants.nodes[0].id)}>Add</Button>
        </InlineLayout>
        {showError && <ErrorBanner/>}
      </BlockStack>
  )
}

function LoadingOffer() {
  return (
      <BlockStack>
        <Heading level={2}>You might also like</Heading>
        <InlineLayout padding={['base', 'none', 'none', 'none']} spacing="base" columns={[64, 'fill', 64]}>
          <SkeletonImage inlineSize={64} blockSize={64}>
          </SkeletonImage>
          <BlockStack>
            <SkeletonText inlineSize="large"/>
            <SkeletonText inlineSize="small"/>
          </BlockStack>
        </InlineLayout>
      </BlockStack>
  )
}

function ErrorBanner() {
  return (
      <Banner
          status="critical"
          title="There was an issue adding this product. Please try again."
      />
  )
}

function EmptyOffer() {
  return (
      <BlockStack></BlockStack>
  )
}
