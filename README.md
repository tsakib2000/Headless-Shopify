# Headless Shopify Frontend

A headless storefront built with React, Vite, React Router, and Tailwind CSS. The `/shop` page lists products published to your Headless storefront through the Storefront GraphQL API.

## Connect Shopify

1. Install the **Headless** sales channel in Shopify Admin and create a storefront. Open the storefront's Storefront API permissions and enable **Read product listings** (`unauthenticated_read_product_listings`). Copy the **public** Storefront API access token.
2. In **Products**, set the products you want to show to **Active** and make them available on the **Headless** sales channel.
3. Copy `.env.example` to `.env.local` and fill in the store's `.myshopify.com` hostname and the public token.

Vite exposes `VITE_*` variables in the browser bundle. Enter only the public Storefront API token here. Keep private Storefront and Admin API credentials server-side.

For the cart, grant **Read checkouts** (`unauthenticated_read_checkouts`) and **Write checkouts** (`unauthenticated_write_checkouts`) in the storefront's Storefront API permissions. Shoppers can add their selected variant on a product page and manage quantities or remove items at `/cart`.

```sh
npm install
npm run dev
```

Restart Vite after editing `.env.local`, then open `/shop`. The catalog shows product images, prices, and availability. Search and filters apply to the full catalog. The Circuit Harbor homepage shortcuts match the Shopify **Product type** values `Phones`, `Drones`, `Audio`, and `Desk Tech` from `technology-products.csv`, ignoring case.

Run `npm run lint` to check the code. For production, run `npm run build` and serve the app with `npm start` on a Node.js host behind HTTPS. The server serves the built frontend, routes direct links to React, and handles the same-origin `/api/cart` endpoint. It keeps the full Shopify cart ID in an HttpOnly cookie. Set the same Shopify environment variables at build time and on the running server.

## Deploy the storefront frontend to Netlify

For a Git-connected deploy, add `VITE_SHOPIFY_STORE_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN` in **Project configuration → Environment variables**. Apply both values to the production deploy context and include the **Builds** scope if scopes are available. The public Storefront API token is the value intended for this browser build.

Trigger a new production deploy after saving the variables. Vite embeds them during `npm run build`. The `netlify.toml` configuration publishes `dist`, and Vite copies `public/_redirects` into the build so direct links such as `/shop` and `/products/<handle>` reach React Router.

For a manual upload, build locally with the Shopify variables already set, then upload the fresh build. Netlify's build environment variables apply when Netlify runs the build. The Express cart endpoint still requires the Node.js hosting setup above.
