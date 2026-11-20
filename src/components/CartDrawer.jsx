import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { useCart } from '../cart/useCart.js'
import { useCartLineActions } from '../cart/useCartLineActions.js'
import { formatMoney } from '../lib/formatMoney.js'
import CartLineItem from './CartLineItem.jsx'

function CartDrawerContents() {
  const { cart, loading, loadError, busy, retry, drawerNotice, closeDrawer } = useCart()
  const { feedback, changeQuantity, removeLine } = useCartLineActions()
  const hasItems = Boolean(cart?.lines.length)
  const ready = !loading && !loadError
  const notice = busy ? 'Updating your cart…' : feedback?.warning || feedback?.success || drawerNotice

  return (
    <>
      <div className="min-h-0 overflow-y-auto overscroll-contain px-5 pb-5 sm:px-6">
        {loading && <p className="pt-6 text-sm text-moss" role="status">Loading your cart…</p>}
        {loadError && (
          <div className="pt-6 text-sm">
            <p role="alert">{loadError}</p>
            <button className="min-h-11 cursor-pointer underline underline-offset-4" type="button" onClick={retry}>
              Try again
            </button>
          </div>
        )}
        {feedback?.error
          ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2.5 text-sm text-red-800" role="alert">{feedback.error}</p>
          : notice && <p className="mt-4 rounded-md bg-oat px-3 py-2.5 text-sm" role="status">{notice}</p>}

        {ready && (hasItems ? (
          <ul className="divide-y divide-line" aria-label="Cart items">
            {cart.lines.map((line) => (
              <CartLineItem
                key={line.id}
                line={line}
                disabled={busy}
                onUpdate={changeQuantity}
                onRemove={removeLine}
                onProductClick={closeDrawer}
              />
            ))}
          </ul>
        ) : (
          <div className="grid min-h-40 place-items-center py-8">
            <p className="font-display text-2xl text-moss">Your cart is empty.</p>
          </div>
        ))}
      </div>

      {ready && (
        <footer className="border-t border-line bg-paper px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
          {hasItems && (
            <dl className="mb-4 flex items-baseline justify-between gap-4">
              <dt className="text-sm font-medium">Subtotal</dt>
              <dd className="text-lg font-semibold">{formatMoney(cart.subtotal.amount, cart.subtotal.currencyCode)}</dd>
            </dl>
          )}
          <Link
            className="flex min-h-12 items-center justify-center rounded-md bg-forest px-4 text-sm font-semibold text-paper hover:bg-moss focus-visible:outline-forest"
            to={hasItems ? '/cart' : '/shop'}
            onClick={closeDrawer}
          >
            {hasItems ? 'View full cart' : 'Continue shopping'}
          </Link>
        </footer>
      )}
    </>
  )
}

export default function CartDrawer() {
  const { cart, drawerNotice, closeDrawer } = useCart()
  const dialogRef = useRef(null)
  const open = drawerNotice !== null
  const quantity = cart?.totalQuantity ?? 0

  useEffect(() => {
    if (!open) return

    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      id="cart-drawer"
      aria-labelledby="cart-drawer-title"
      className="cart-drawer h-dvh max-h-none w-full max-w-[30rem] overflow-hidden bg-paper text-forest shadow-2xl backdrop:bg-forest/50"
      onCancel={(event) => {
        event.preventDefault()
        closeDrawer()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDrawer()
      }}
    >
      {open && (
        <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
          <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 id="cart-drawer-title" className="font-display text-4xl leading-none tracking-[-0.055em]">Your cart</h2>
              <span className="text-sm text-moss">{quantity} {quantity === 1 ? 'item' : 'items'}</span>
            </div>
            <button
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-2xl leading-none hover:bg-oat"
              type="button"
              aria-label="Close cart"
              onClick={closeDrawer}
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <CartDrawerContents />
        </div>
      )}
    </dialog>
  )
}
