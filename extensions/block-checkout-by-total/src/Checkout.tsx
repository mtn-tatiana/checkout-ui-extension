import React, {useState} from 'react';
import {
  reactExtension,
  Banner,
  useSubtotalAmount,
  useBuyerJourneyIntercept,
  useExtensionCapability
} from "@shopify/ui-extensions-react/checkout";
import type { Money } from '@shopify/ui-extensions/checkout';

export default reactExtension("purchase.checkout.block.render", () => (
    <Extension/>
));

function Extension() {
   let total:Money = useSubtotalAmount();
   const [showError, setShowError] = useState(false);
   const canBlock:boolean = useExtensionCapability("block_progress");

   useBuyerJourneyIntercept(() => {
       return (canBlock && total.amount < 1000) ? {
             behavior: 'block',
             reason: 'Invalid total amount',
             perform: (result) => {
               setShowError(true)
             },
           }
           : {
             behavior: 'allow',
             perform: () => {
               setShowError(false)
             },
           };
     },
   );

  return showError ? (
      <Banner title="" status="warning">
        Total must be more than $1000
      </Banner>
  ) : null;
}
