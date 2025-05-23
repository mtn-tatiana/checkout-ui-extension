import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
    const { customerId, metafieldNamespace, metafieldKey, value } = await request.json();
    if (!customerId) {
        return json({ error: "Customer ID is required" }, { status: 400 });
    }

    try {
        const SHOPIFY_API_URL = `https://dev-13.myshopify.com/admin/api/2024-07/customers/${customerId}/metafields.json`;

        const metafield = {
            namespace: metafieldNamespace,
            key: metafieldKey,
            value,
            type: "single_line_text_field",
        };

        const response = await fetch(SHOPIFY_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_TOKEN || "",
            },
            body: JSON.stringify({ metafield }),
        });

        const result = await response.json();


        return json({ data: result });
    } catch (error) {
        console.error("Error fetching customer:", error);
        return json({ error: "Failed to fetch customer" }, { status: 500 });
    }
};
