import {
  reactExtension,
  View,
  useCustomer,
  TextField
} from "@shopify/ui-extensions-react/checkout";
import {useEffect, useState} from "react";

export default reactExtension("purchase.checkout.block.render", () => (
    <Extension/>
));

function Extension() {
  const customer = useCustomer();
  const customerId = customer?.id.split('/').pop();
  const [hasTag, setHasTag] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    async function fetchTag() {
      if (!customerId) {
        console.log('No customer ID available');
        return;
      }

      try {
        const response = await fetch(`https://tongue-lifetime-volvo-receptors.trycloudflare.com/get_tag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: customerId }),
        });

        if (!response.ok) {
          console.log(response)
          return;
        }

        const tagData = await response.json();
        if(tagData.data.indexOf('VIP') !== -1) {
          setHasTag(true)
        }

      } catch (error) {
        console.log(error)
        console.error('Error fetching metafields:', error);
      }
    }

    fetchTag();
  }, [customerId]);
//${process.env.APP_URL}
  async function saveField (value:string | undefined) {
    setIsSaving(true);
    try {
      const response = await fetch(`https://tongue-lifetime-volvo-receptors.trycloudflare.com/save_metafield`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          metafieldNamespace: 'custom',
          metafieldKey: 'testing',
          value: value
        }),
      });
      setIsSaving(false);

      if (!response.ok) {
        console.log(response)
        return;
      }
    } catch (error) {
      console.log(error)
      console.error('Error fetching metafields:', error);
    }
  }

  return (
      <View border="none" padding="none">
        {hasTag && (
            <TextField
                label="Customer info"
                onChange={saveField}
                disabled={isSaving}
            />
        )}
      </View>
  );
}
