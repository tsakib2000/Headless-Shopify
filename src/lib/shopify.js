import { requestStorefront } from './storefrontRequest.js'

const productsQuery = `
  query ShopProducts($after: String) {
    products(first: 100, after: $after) {
      nodes {
        id
        handle
        title
        productType
        availableForSale
        featuredImage {
          url(transform: { maxWidth: 720 })
          altText
        }
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

const productDetailsQuery = `
  query ProductDetails($handle: String!, $after: String) {
    product(handle: $handle) {
      title
      description
      featuredImage {
        url(transform: { maxWidth: 1200 })
        altText
      }
      options {
        name
        optionValues { name }
      }
      variants(first: 100, after: $after) {
        nodes {
          id
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
          quantityRule { minimum }
          image {
            url(transform: { maxWidth: 1200 })
            altText
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`

function fetchStorefront(query, variables, signal) {
  return requestStorefront({
    domain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
    token: import.meta.env.VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN,
  }, query, variables, signal)
}

function nextPageCursor({ hasNextPage, endCursor }, previousCursor) {
  if (!hasNextPage) return null
  if (!endCursor || endCursor === previousCursor) {
    throw new Error('Shopify could not return the next page.')
  }
  return endCursor
}

export async function fetchShopProducts(signal) {
  const products = []
  let after = null

  do {
    const data = await fetchStorefront(productsQuery, { after }, signal)
    const { nodes, pageInfo } = data.products
    products.push(...nodes)
    after = nextPageCursor(pageInfo, after)
  } while (after)

  return products
}

export async function fetchProductByHandle(handle, signal) {
  const { product } = await fetchStorefront(productDetailsQuery, { handle, after: null }, signal)
  if (!product) return null

  const { variants: firstPage, ...details } = product
  const variants = [...firstPage.nodes]
  let after = nextPageCursor(firstPage.pageInfo, null)

  while (after) {
    const { product: nextProduct } = await fetchStorefront(productDetailsQuery, { handle, after }, signal)
    if (!nextProduct) return null

    variants.push(...nextProduct.variants.nodes)
    after = nextPageCursor(nextProduct.variants.pageInfo, after)
  }

  return { ...details, variants }
}
