import { useState } from 'react'
import { useCart } from '../cart/useCart.js'
import { formatMoney } from '../lib/formatMoney.js'
import VariantPicker from './VariantPicker.jsx'

export default function ProductDetails({ product }) {
  const { title, description, featuredImage, options, variants } = product
  const [selectedId, setSelectedId] = useState(() =>
    (variants.find(({ availableForSale }) => availableForSale) ?? variants[0])?.id,
  )
  const [error, setError] = useState('')
  const { addItem, loading, busy, openDrawer } = useCart()
  const selectedVariant = variants.find(({ id }) => id === selectedId)
  const image = selectedVariant?.image ?? featuredImage
  const quantity = selectedVariant?.quantityRule?.minimum ?? 1

  function selectVariant(id) {
    setSelectedId(id)
    setError('')
  }

  async function addSelectedVariant() {
    if (busy || !selectedVariant?.availableForSale) return
    setError('')
    const result = await addItem(selectedVariant.id, quantity)
    if (!result) return
    if (result.error) setError(result.error)
    else openDrawer(result.warning || 'Added to cart.')
  }

  return (
    <article className={image ? 'grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8' : 'max-w-3xl'}>
      {image && (
        <img
          className="aspect-square w-full rounded-2xl border border-line bg-surface object-contain p-4 sm:p-6"
          src={image.url}
          alt={image.altText || title}
        />
      )}
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-8">
        <h1 className="font-display text-[clamp(2rem,4.8vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.065em] [overflow-wrap:anywhere]">{title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2" role="status">
          {selectedVariant && (
            <p className="text-2xl font-semibold">
              {formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
            </p>
          )}
          <p className={`rounded-full px-3 py-1 text-sm font-medium ${selectedVariant?.availableForSale ? 'bg-emerald-50 text-emerald-800' : 'bg-subtle text-muted'}`}>
            {selectedVariant
              ? (selectedVariant.availableForSale ? 'Available' : 'Sold out')
              : 'This variant is unavailable.'}
          </p>
        </div>

        {variants.length > 1 && selectedVariant && (
          <VariantPicker
            options={options}
            variants={variants}
            selectedVariant={selectedVariant}
            onSelect={selectVariant}
            disabled={busy}
          />
        )}

        <button
          className="shop-action mt-6 min-h-13 w-full cursor-pointer disabled:cursor-not-allowed disabled:bg-line disabled:text-muted aria-disabled:cursor-wait aria-disabled:bg-line aria-disabled:text-muted"
          type="button"
          disabled={loading || !selectedVariant?.availableForSale}
          aria-disabled={busy || undefined}
          onClick={addSelectedVariant}
        >
          {busy ? 'Updating cart…' : quantity > 1 ? `Add ${quantity} to cart` : 'Add to cart'}
        </button>
        {error && <p className="mt-3 text-sm text-red-800" role="alert">{error}</p>}
        {description && <p className="mt-7 max-w-[60ch] whitespace-pre-line border-t border-line pt-6 text-muted">{description}</p>}
      </div>
    </article>
  )
}
