import { formatMoney } from '../lib/formatMoney.js'

export default function ProductCard({
  title,
  category,
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
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface group-hover:border-brand">
      <div className="relative aspect-square overflow-hidden border-b border-line bg-subtle sm:aspect-[1.2]">
        {imageUrl ? (
          <img
            className="size-full bg-surface object-contain p-2 motion-safe:transition-transform motion-safe:group-hover:scale-[1.04] sm:p-3"
            src={imageUrl}
            alt={imageAlt || title}
            loading="lazy"
          />
        ) : (
          <div className="grid size-full place-items-center bg-linear-to-br from-subtle to-[#e1e9ff] text-center text-xs text-muted" aria-hidden="true">
            Image unavailable
          </div>
        )}
        {soldOut && <span className="absolute top-2 left-2 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold">Sold out</span>}
      </div>
      <div className="flex flex-1 flex-col px-3 py-4 sm:p-4">
        {category && <p className="mb-1.5 text-xs font-medium text-muted">{category}</p>}
        <h2 className="font-display text-base leading-tight font-bold tracking-[-0.035em] [overflow-wrap:anywhere] group-hover:text-brand sm:text-lg">{title}</h2>
        <p className="mt-auto pt-3 text-sm font-semibold sm:text-base">{priceLabel}</p>
      </div>
    </article>
  )
}
