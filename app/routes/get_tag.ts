import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
    const { customerId } = await request.json();
    if (!customerId) {
        return json({ error: "Customer ID is required" }, { status: 400 });
    }

    try {
        const SHOPIFY_API_URL = `https://dev-13.myshopify.com/admin/api/2024-07/customers/${customerId}.json`;

        const response = await fetch(SHOPIFY_API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_TOKEN || "",
            },
        });

        const result = await response.json();
        const customer = result?.customer;

        return json({ data: customer.tags });
    } catch (error) {
        console.error("Error fetching customer:", error);
        return json({ error: "Failed to fetch customer" }, { status: 500 });
    }
};
