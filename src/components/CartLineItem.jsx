import { Link } from 'react-router'
import { formatMoney } from '../lib/formatMoney.js'

const stepperClass = 'grid size-10 cursor-pointer place-items-center text-lg hover:bg-oat disabled:cursor-not-allowed disabled:opacity-40'

export default function CartLineItem({ line, disabled, onUpdate, onRemove, onProductClick }) {
  const { id, quantity, merchandise, cost } = line
  const { product, title: variantTitle, quantityRule } = merchandise
  const image = merchandise.image ?? product.featuredImage
  const { minimum, maximum, increment } = quantityRule
  const showVariant = variantTitle !== 'Default Title'
  const itemName = showVariant ? `${product.title}, ${variantTitle}` : product.title
  const lineTotal = cost.totalAmount

  return (
    <li className="grid grid-cols-[4rem_1fr] gap-x-4 gap-y-3 py-5 sm:grid-cols-[5rem_1fr_auto] sm:gap-x-5">
      {image ? (
        <img
          className="aspect-square w-full rounded-md bg-oat object-cover"
          src={image.url}
          alt={image.altText || product.title}
          loading="lazy"
        />
      ) : <div className="aspect-square rounded-md bg-oat" aria-hidden="true" />}

      <div className="min-w-0">
        <h2 className="font-display text-xl [overflow-wrap:anywhere]">
          <Link className="underline-offset-4 hover:underline" to={`/products/${encodeURIComponent(product.handle)}`} onClick={onProductClick}>
            {product.title}
          </Link>
        </h2>
        {showVariant && <p className="mt-1 text-sm text-moss">{variantTitle}</p>}
        <p className="mt-2 font-semibold sm:hidden">{formatMoney(lineTotal.amount, lineTotal.currencyCode)}</p>
      </div>
      <p className="hidden text-right font-semibold sm:block">{formatMoney(lineTotal.amount, lineTotal.currencyCode)}</p>

      <div className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="inline-flex items-center rounded-md border border-line" role="group" aria-label={`Quantity for ${itemName}`}>
          <button
            type="button"
            className={stepperClass}
            disabled={disabled || quantity - increment < minimum}
            aria-label={`Decrease quantity of ${itemName}`}
            onClick={() => onUpdate(id, quantity - increment)}
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
          <button
            type="button"
            className={stepperClass}
            disabled={disabled || (maximum !== null && quantity + increment > maximum)}
            aria-label={`Increase quantity of ${itemName}`}
            onClick={() => onUpdate(id, quantity + increment)}
          >
            +
          </button>
        </div>
        <button
          className="min-h-10 cursor-pointer text-sm text-moss underline underline-offset-4 hover:text-forest disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={disabled}
          aria-label={`Remove ${itemName}`}
          onClick={() => onRemove(id)}
        >
          Remove
        </button>
      </div>
    </li>
  )
}
