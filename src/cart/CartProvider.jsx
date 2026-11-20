import { useEffect, useRef, useState } from 'react'
import { CartContext } from './useCart.js'

const networkError = 'Could not connect to the cart. Please try again.'

async function requestCart(options) {
  const response = await fetch('/api/cart', options)
  const data = await response.json()
  return { ...data, ok: response.ok, status: response.status }
}

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [activeAction, setActiveAction] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [drawerNotice, setDrawerNotice] = useState(null)
  const pending = useRef(false)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const result = await requestCart({ signal: controller.signal })
        if (!result.ok) throw new Error(result.error)
        if (!controller.signal.aborted) setCart(result.cart)
      } catch {
        if (!controller.signal.aborted) {
          setLoadError('Could not load your cart. Check the connection and try again.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [attempt])

  function retry() {
    setLoading(true)
    setLoadError('')
    setAttempt((value) => value + 1)
  }

  async function refreshAfterFailure() {
    try {
      const result = await requestCart()
      if (result.ok) {
        setCart(result.cart)
        setLoadError('')
      }
    } catch {
      // Preserve the last confirmed cart if its current state cannot be retrieved.
    }
  }

  async function runCartAction(action) {
    if (loading || pending.current) return null
    pending.current = true
    setActiveAction(action.action)

    try {
      const result = await requestCart({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      })
      if ('cart' in result) {
        setCart(result.cart)
        setLoadError('')
      }
      if (result.status >= 500) await refreshAfterFailure()
      return result.ok
        ? { warning: result.warning, checkoutUrl: result.checkoutUrl }
        : { error: result.error || networkError }
    } catch {
      await refreshAfterFailure()
      return { error: networkError }
    } finally {
      pending.current = false
      setActiveAction('')
    }
  }

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      loadError,
      busy: Boolean(activeAction),
      checkingOut: activeAction === 'checkout',
      retry,
      drawerNotice,
      openDrawer: (notice = '') => setDrawerNotice(notice),
      closeDrawer: () => setDrawerNotice(null),
      addItem: (merchandiseId, quantity) => runCartAction({ action: 'add', merchandiseId, quantity }),
      updateQuantity: (lineId, quantity) => runCartAction({ action: 'update', lineId, quantity }),
      removeItem: (lineId) => runCartAction({ action: 'remove', lineId }),
      startCheckout: () => runCartAction({ action: 'checkout' }),
    }}>
      {children}
    </CartContext.Provider>
  )
}
