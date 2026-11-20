import { Link, NavLink, useLocation } from 'react-router'
import { useCart } from '../cart/useCart.js'

const shopLinks = [
  { label: 'All tech', to: '/shop' },
  { label: 'Phones', to: '/shop?category=phones', category: 'phones' },
  { label: 'Drones', to: '/shop?category=drones', category: 'drones' },
]

export default function StoreHeader() {
  const { cart, drawerNotice, openDrawer } = useCart()
  const { pathname, search } = useLocation()
  const quantity = cart?.totalQuantity ?? 0
  const category = new URLSearchParams(search).get('category')?.toLowerCase() || undefined

  return (
    <header className="border-b border-line bg-surface">
      <div className="page-width grid grid-cols-[1fr_auto] items-center gap-x-4 sm:min-h-19 sm:grid-cols-[1fr_auto_1fr] sm:gap-x-6">
        <Link to="/" className="col-start-1 row-start-1 inline-flex w-fit items-center gap-2.5 py-3.5 sm:py-0" aria-label="Circuit Harbor home">
          <span
            className="relative grid size-9 shrink-0 place-items-center rounded-[0.65rem] bg-brand before:absolute before:size-4 before:rotate-45 before:rounded-[0.2rem] before:border-[2px] before:border-white after:absolute after:size-1.5 after:rotate-45 after:bg-volt"
            aria-hidden="true"
          />
          <span className="whitespace-nowrap font-display text-[1.28rem] leading-none font-bold tracking-[-0.065em] sm:text-2xl">Circuit Harbor</span>
        </Link>

        <nav
          className="col-span-2 row-start-2 flex items-center gap-5 border-t border-line text-sm font-semibold sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:gap-5 sm:border-0 lg:gap-8 [&_a]:py-3 [&_a]:underline-offset-[0.45em] [&_a:hover]:text-brand [&_a[aria-current=page]]:text-brand [&_a[aria-current=page]]:underline"
          aria-label="Main navigation"
        >
          {shopLinks.map((link) => (
            <Link key={link.to} to={link.to} aria-current={pathname === '/shop' && link.category === category ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
          <NavLink to="/about">About</NavLink>
        </nav>

        <div className="col-start-2 row-start-1 flex items-center gap-2 justify-self-end text-sm font-semibold sm:col-start-3 lg:gap-4">
          <Link
            className="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-subtle hover:text-brand"
            to="/shop#catalog-search"
            aria-label="Search products"
          >
            <span
              aria-hidden="true"
              className="relative mr-0.5 size-3.5 rounded-full border-[1.75px] border-current after:absolute after:-right-1 after:-bottom-0.5 after:h-[1.75px] after:w-1.5 after:rotate-45 after:bg-current"
            />
          </Link>
          <button
            type="button"
            className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-line px-3 hover:border-brand hover:text-brand"
            aria-label={`Cart, ${quantity} ${quantity === 1 ? 'item' : 'items'}`}
            aria-haspopup="dialog"
            aria-controls="cart-drawer"
            aria-expanded={drawerNotice !== null}
            onClick={() => openDrawer()}
          >
            Cart
            <span aria-hidden="true" className="grid min-h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-xs text-white">
              {quantity}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
