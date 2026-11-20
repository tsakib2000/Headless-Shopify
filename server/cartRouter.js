import express from 'express'
import { createShopifyCartClient } from './shopifyCart.js'

function readCartCookie(header, name) {
  const entry = header?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))
  try {
    return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null
  } catch {
    return null
  }
}

function shopifyMessage(issues, cartId) {
  const key = cartId?.split('?key=')[1]
  const messages = issues.map(({ message }) => message).filter((message) =>
    !(cartId && message.includes(cartId)) && !(key && message.includes(key)),
  )
  return [...new Set(messages)].join(' ')
}

export function createCartRouter(config, { secure = false } = {}) {
  const router = express.Router()
  const shopify = createShopifyCartClient(config)
  const cookieName = secure ? '__Host-outpost-cart' : 'outpost-cart'
  const cookieOptions = { httpOnly: true, secure, sameSite: 'lax', path: secure ? '/' : '/api/cart' }

  router.use((_request, response, next) => {
    response.set('Cache-Control', 'no-store')
    next()
  })
  router.use(express.json({ limit: '4kb' }))

  router.get('/', async (request, response) => {
    const cartId = readCartCookie(request.headers.cookie, cookieName)
    const snapshot = cartId ? await shopify.readPage(cartId) : null
    const cart = snapshot ? await shopify.toPublicCart(snapshot) : null
    if (cartId && !cart) response.clearCookie(cookieName, cookieOptions)
    response.json({ cart })
  })

  router.post('/', async (request, response) => {
    const { action, merchandiseId, lineId, quantity } = request.body ?? {}
    const cartId = readCartCookie(request.headers.cookie, cookieName)

    if (action === 'checkout') {
      const cart = cartId ? await shopify.readCheckout(cartId) : null
      if (cartId && !cart) response.clearCookie(cookieName, cookieOptions)
      if (!cart?.totalQuantity) {
        return response.status(409).json({ cart: null, error: 'Add an item before checking out.' })
      }

      const url = URL.canParse(cart.checkoutUrl) ? new URL(cart.checkoutUrl) : null
      if (url?.protocol !== 'https:' || url.username || url.password) {
        return response.status(502).json({ error: 'Shopify could not open checkout. Please try again.' })
      }
      return response.json({ checkoutUrl: cart.checkoutUrl })
    }

    const validQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= 2147483647
    const validLine = typeof lineId === 'string' && lineId.length > 0 && lineId.length <= 2048
    let payload

    switch (action) {
      case 'add':
        if (typeof merchandiseId !== 'string' || !/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(merchandiseId) || !validQuantity) break
        payload = await shopify.add(cartId, { merchandiseId, quantity })
        break
      case 'update':
        if (!cartId || !validLine || !validQuantity) break
        payload = await shopify.update(cartId, { id: lineId, quantity })
        break
      case 'remove':
        if (!cartId || !validLine) break
        payload = await shopify.remove(cartId, lineId)
        break
    }

    if (!payload) {
      if (validLine && !cartId && (action === 'update' || action === 'remove')) {
        return response.status(409).json({ cart: null, error: 'This cart is no longer available.' })
      }
      return response.status(400).json({ error: 'Choose a valid product variant or cart quantity.' })
    }

    const snapshot = payload.cart ?? (cartId ? await shopify.readPage(cartId) : null)
    if (snapshot) response.cookie(cookieName, snapshot.id, cookieOptions)
    else if (cartId) response.clearCookie(cookieName, cookieOptions)

    const cart = snapshot ? await shopify.toPublicCart(snapshot) : null
    if (payload.userErrors.length || !cart) {
      const error = shopifyMessage(payload.userErrors, snapshot?.id ?? cartId)
        || 'Shopify could not update this cart. Please try again.'
      return response.status(409).json({ cart, error })
    }

    return response.json({ cart, warning: shopifyMessage(payload.warnings, snapshot.id) })
  })

  router.use((error, _request, response, next) => {
    if (response.headersSent) return next(error)
    if (error.status === 400 || error.status === 413) {
      return response.status(error.status).json({ error: 'The cart request was invalid.' })
    }
    return response.status(502).json({
      error: 'Could not reach the Shopify cart. Check the Storefront API cart permissions or try again.',
    })
  })

  return router
}
