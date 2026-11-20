import { formatMoney } from '../lib/formatMoney.js'

export default function ProductCard({
  title,
  imageUrl,
  imageAlt,
  price,
  currency,
  maxPrice = price,
  soldOut = false,
}) {
  const formattedPrice = formatMoney(price, currency)
  const priceLabel = Number(price) === Number(maxPrice) ? formattedPrice : `From ${formattedPrice}`

  return (
    <article className="h-full overflow-hidden rounded-md border border-line">
      {imageUrl && (
        <img
          className="aspect-square w-full bg-oat object-cover"
          src={imageUrl}
          alt={imageAlt || title}
          loading="lazy"
        />
      )}
      <div className="p-4">
        <h2 className="font-display text-xl">{title}</h2>
        <p className="mt-1 text-sm text-moss">{priceLabel}</p>
        {soldOut && <p className="mt-2 text-sm font-medium">Sold out</p>}
      </div>
    </article>
  )
}
