import { useEffect } from 'react'
import { Link } from 'react-router'
import { useCart } from '../cart/useCart.js'
import { useCartLineActions } from '../cart/useCartLineActions.js'
import CartLineItem from '../components/CartLineItem.jsx'
import { formatMoney } from '../lib/formatMoney.js'

export default function CartPage() {
  const { cart, loading, loadError, busy, retry } = useCart()
  const { feedback, changeQuantity, removeLine } = useCartLineActions()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section className="page-width py-8 sm:py-12" aria-labelledby="cart-title">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 id="cart-title" className="page-heading">Your cart</h1>
        <Link className="text-sm font-semibold text-brand underline-offset-4 hover:underline" to="/shop">Continue shopping</Link>
      </div>

      {loading && <p className="mt-7" role="status">Loading your cart…</p>}
      {loadError && (
        <div className="mt-7 rounded-md border border-line p-5">
          <p role="alert">{loadError}</p>
          <button type="button" className="mt-2 min-h-11 cursor-pointer underline underline-offset-4" onClick={retry}>
            Try again
          </button>
        </div>
      )}
      {busy && <p className="mt-5 text-sm text-muted" role="status">Updating your cart…</p>}
      {feedback?.error && <p className="mt-5 text-sm text-red-800" role="alert">{feedback.error}</p>}
      {feedback && !feedback.error && (
        <p className="mt-5 text-sm text-muted" role="status">{feedback.warning || feedback.success}</p>
      )}

      {!loading && !loadError && (
        cart?.lines.length ? (
          <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.45fr)] lg:gap-9">
            <ul className="divide-y divide-line rounded-xl border border-line bg-surface px-4 sm:px-5" aria-label="Cart items">
              {cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} disabled={busy} onUpdate={changeQuantity} onRemove={removeLine} />
              ))}
            </ul>
            <aside className="rounded-xl border border-line bg-surface p-5 sm:p-6" aria-labelledby="summary-title">
              <h2 id="summary-title" className="font-display text-2xl font-bold tracking-[-0.035em]">Order summary</h2>
              <dl className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between gap-4 text-sm text-muted">
                  <dt>Items</dt>
                  <dd>{cart.totalQuantity}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3 font-semibold">
                  <dt>Subtotal</dt>
                  <dd>{formatMoney(cart.subtotal.amount, cart.subtotal.currencyCode)}</dd>
                </div>
              </dl>
            </aside>
          </div>
        ) : (
          <p className="mt-7 rounded-xl border border-line bg-surface px-5 py-10 text-center text-muted">Your cart is empty.</p>
        )
      )}
    </section>
  )
}
