import { requestStorefront } from '../src/lib/storefrontRequest.js'

const cartSummary = `
  fragment CartSummary on Cart {
    id
    totalQuantity
    cost { subtotalAmount { amount currencyCode } }
  }
`

const cartLines = `
  fragment CartLines on BaseCartLineConnection {
    nodes {
      id
      quantity
      cost { totalAmount { amount currencyCode } }
      merchandise {
        ... on ProductVariant {
          title
          quantityRule { minimum maximum increment }
          image { url(transform: { maxWidth: 320 }) altText }
          product {
            title
            handle
            featuredImage { url(transform: { maxWidth: 320 }) altText }
          }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
`

const mutationFields = `
  cart {
    ...CartSummary
    lines(first: 100) { ...CartLines }
  }
  userErrors { message }
  warnings { message }
`

export const cartQueries = {
  read: `
    query ReadCart($cartId: ID!, $after: String) {
      cart(id: $cartId) {
        ...CartSummary
        lines(first: 100, after: $after) { ...CartLines }
      }
    }
    ${cartSummary}
    ${cartLines}
  `,
  create: `
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) { ${mutationFields} }
    }
    ${cartSummary}
    ${cartLines}
  `,
  add: `
    mutation CartAddLines($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { ${mutationFields} }
    }
    ${cartSummary}
    ${cartLines}
  `,
  update: `
    mutation CartUpdateLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { ${mutationFields} }
    }
    ${cartSummary}
    ${cartLines}
  `,
  remove: `
    mutation CartRemoveLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { ${mutationFields} }
    }
    ${cartSummary}
    ${cartLines}
  `,
}

export function createShopifyCartClient(config) {
  const request = (operation, variables) =>
    requestStorefront(config, cartQueries[operation], variables, AbortSignal.timeout(15000))

  async function readPage(cartId, after = null) {
    const { cart } = await request('read', { cartId, after })
    return cart
  }

  async function toPublicCart(snapshot) {
    const lines = [...snapshot.lines.nodes]
    let pageInfo = snapshot.lines.pageInfo
    let after = null

    while (pageInfo.hasNextPage) {
      if (!pageInfo.endCursor || pageInfo.endCursor === after) {
        throw new Error('Shopify could not return the next page of cart items.')
      }
      after = pageInfo.endCursor
      const page = await readPage(snapshot.id, after)
      if (!page) return null
      lines.push(...page.lines.nodes)
      pageInfo = page.lines.pageInfo
    }

    return {
      lines,
      totalQuantity: snapshot.totalQuantity,
      subtotal: snapshot.cost.subtotalAmount,
    }
  }

  async function add(cartId, line) {
    if (cartId) {
      const { cartLinesAdd } = await request('add', { cartId, lines: [line] })
      if (cartLinesAdd.cart || await readPage(cartId)) return cartLinesAdd
    }
    const { cartCreate } = await request('create', { input: { lines: [line] } })
    return cartCreate
  }

  async function update(cartId, line) {
    const { cartLinesUpdate } = await request('update', { cartId, lines: [line] })
    return cartLinesUpdate
  }

  async function remove(cartId, lineId) {
    const { cartLinesRemove } = await request('remove', { cartId, lineIds: [lineId] })
    return cartLinesRemove
  }

  return { readPage, toPublicCart, add, update, remove }
}
