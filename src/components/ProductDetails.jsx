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
    <article className={image ? 'grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14' : undefined}>
      {image && (
        <img
          className="aspect-square w-full rounded-md border border-line bg-oat object-contain"
          src={image.url}
          alt={image.altText || title}
        />
      )}
      <div>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-[-0.05em]">{title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2" role="status">
          {selectedVariant && (
            <p className="text-2xl font-semibold">
              {formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
            </p>
          )}
          <p className={`rounded-full px-3 py-1 text-sm ${selectedVariant?.availableForSale ? 'bg-oat text-forest' : 'bg-line text-moss'}`}>
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
          className="mt-6 min-h-13 w-full cursor-pointer rounded-md bg-forest px-5 py-3 font-semibold text-paper hover:bg-moss disabled:cursor-not-allowed disabled:bg-line disabled:text-moss aria-disabled:cursor-wait aria-disabled:bg-line aria-disabled:text-moss"
          type="button"
          disabled={loading || !selectedVariant?.availableForSale}
          aria-disabled={busy || undefined}
          onClick={addSelectedVariant}
        >
          {busy ? 'Updating cart…' : quantity > 1 ? `Add ${quantity} to cart` : 'Add to cart'}
        </button>
        {error && <p className="mt-3 text-sm text-red-800" role="alert">{error}</p>}
        {description && <p className="mt-7 max-w-[60ch] whitespace-pre-line border-t border-line pt-6 text-moss">{description}</p>}
      </div>
    </article>
  )
}
