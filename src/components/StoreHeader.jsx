import { Link, NavLink } from 'react-router'
import { useCart } from '../cart/useCart.js'

export default function StoreHeader() {
  const { cart, drawerNotice, openDrawer } = useCart()
  const quantity = cart?.totalQuantity ?? 0

  return (
    <header className="border-b border-line">
      <div className="bg-forest px-4 py-2.5 text-center text-sm tracking-wide text-paper">
        <Link className="rounded-sm underline-offset-4 hover:underline" to="/shop">
          Explore the Outpost Supply catalog
        </Link>
      </div>
      <div className="page-width grid grid-cols-[1fr_auto] items-center gap-x-6 sm:min-h-[5.25rem] sm:grid-cols-[1fr_auto_1fr]">
        <Link to="/" className="flex w-fit items-center gap-2.5 py-4 sm:py-0" aria-label="Outpost Supply home">
          <span aria-hidden="true" className="h-7 w-8 shrink-0 bg-forest [clip-path:polygon(0_100%,35%_35%,47%_56%,67%_12%,100%_100%,64%_100%,54%_79%,44%_100%)]" />
          <span className="text-[1.35rem] leading-none font-black tracking-[-0.045em]">
            OUTPOST
            <small className="mt-1 block text-[0.625rem] font-bold tracking-[0.24em]">SUPPLY CO.</small>
          </span>
        </Link>

        <nav
          className="col-span-2 row-start-2 flex items-center gap-7 border-t border-line text-sm font-medium sm:col-span-1 sm:row-start-1 sm:gap-8 sm:border-0 lg:gap-10 [&_a]:py-3.5 [&_a]:underline-offset-[0.55em] [&_a:hover]:underline [&_a[aria-current=page]]:font-bold [&_a[aria-current=page]]:underline"
          aria-label="Main navigation"
        >
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">Our story</NavLink>
        </nav>

        <div className="col-start-2 row-start-1 flex items-center gap-3 justify-self-end text-sm font-medium sm:col-start-3 lg:gap-5">
          <Link
            className="inline-flex min-h-11 min-w-8 items-center justify-center gap-2 underline-offset-4 hover:underline"
            to="/shop#catalog-search"
            aria-label="Search products"
          >
            <span
              aria-hidden="true"
              className="relative mr-0.5 size-3.5 rounded-full border-[1.5px] border-current after:absolute after:-right-1 after:-bottom-0.5 after:h-px after:w-1.5 after:rotate-45 after:bg-current"
            />
            <span className="hidden lg:inline">Search</span>
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 underline-offset-4 hover:underline"
            aria-label={`Cart, ${quantity} ${quantity === 1 ? 'item' : 'items'}`}
            aria-haspopup="dialog"
            aria-controls="cart-drawer"
            aria-expanded={drawerNotice !== null}
            onClick={() => openDrawer()}
          >
            Cart
            <span aria-hidden="true" className="grid min-h-6 min-w-6 place-items-center rounded-full bg-forest px-1.5 text-xs text-paper">
              {quantity}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
