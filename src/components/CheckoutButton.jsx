import { useState } from 'react'
import { useCart } from '../cart/useCart.js'

export default function CheckoutButton() {
  const { cart, busy, checkingOut, startCheckout } = useCart()
  const [error, setError] = useState('')

  async function openCheckout() {
    setError('')
    const result = await startCheckout()
    if (!result) return
    if (result.checkoutUrl) {
      window.location.assign(result.checkoutUrl)
    } else {
      setError(result.error || 'Shopify could not open checkout. Please try again.')
    }
  }

  return (
    <div>
      <button
        className="shop-action w-full cursor-pointer disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        type="button"
        disabled={busy || !cart?.totalQuantity}
        onClick={openCheckout}
      >
        {checkingOut ? 'Opening checkout…' : 'Checkout'}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-red-800">{error}</p>}
    </div>
  )
}
