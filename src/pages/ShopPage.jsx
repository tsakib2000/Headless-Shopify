import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import ProductCard from '../components/ProductCard.jsx'
import { fetchShopProducts } from '../lib/shopify.js'

export default function ShopPage() {
  const [catalog, setCatalog] = useState(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const { hash, key, search } = useLocation()
  const searchInput = useRef(null)
  const category = searchParams.get('category')?.trim().toLowerCase() ?? ''
  const query = searchParams.get('q') ?? ''
  const searchTerm = query.trim().toLowerCase()
  const products = catalog ?? []
  const categories = new Map()

  for (const { productType } of products) {
    const label = productType.trim()
    if (label) categories.set(label.toLowerCase(), label)
  }

  const results = products.filter(({ title, productType }) =>
    (!category || productType.trim().toLowerCase() === category) &&
    `${title} ${productType}`.toLowerCase().includes(searchTerm),
  )

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        const nextProducts = await fetchShopProducts(controller.signal)
        if (!controller.signal.aborted) setCatalog(nextProducts)
      } catch (failure) {
        if (!controller.signal.aborted) setError(failure.message)
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [attempt])

  useEffect(() => {
    if (hash === '#catalog-search' && catalog) searchInput.current.focus()
  }, [catalog, hash, key])

  function updateSearch(event) {
    const value = event.target.value
    const nextParams = new URLSearchParams(searchParams)
    if (value) nextParams.set('q', value)
    else nextParams.delete('q')
    setSearchParams(nextParams, { replace: true, preventScrollReset: true })
  }

  function categoryLink(id) {
    const nextParams = new URLSearchParams()
    if (id) nextParams.set('category', id)
    if (query) nextParams.set('q', query)
    const search = nextParams.toString()
    return search ? `/shop?${search}` : '/shop'
  }

  function retry() {
    setError('')
    setAttempt((value) => value + 1)
  }

  return (
    <section className="page-width py-10 sm:py-14" aria-labelledby="shop-title">
      <h1 id="shop-title" className="page-heading">Shop all products</h1>

      {error && (
        <div className="mt-8 rounded-md border border-line p-5">
          <p role="alert">{error}</p>
          <button className="mt-3 min-h-11 underline underline-offset-4" onClick={retry} type="button">
            Try again
          </button>
        </div>
      )}
      {!catalog && !error && <p className="mt-8" role="status">Loading products…</p>}

      {catalog && (
        <>
          <div className="mt-8 rounded-md border border-line p-5">
            <label className="block font-semibold" htmlFor="catalog-search">Search products</label>
            <input
              className="mt-3 block min-h-12 w-full max-w-md rounded-sm border border-line bg-white px-3"
              ref={searchInput}
              id="catalog-search"
              type="search"
              value={query}
              onChange={updateSearch}
              placeholder="Search by product name or type"
            />
            {(categories.size > 0 || category) && (
              <nav className="mt-4 flex flex-wrap gap-2 text-sm [&_a]:rounded-sm [&_a]:border [&_a]:border-line [&_a]:px-3 [&_a]:py-2 [&_a:hover]:bg-oat [&_a[aria-current=true]]:border-forest [&_a[aria-current=true]]:bg-forest [&_a[aria-current=true]]:text-paper" aria-label="Filter by product type">
                <Link to={categoryLink()} aria-current={category ? undefined : 'true'}>All</Link>
                {[...categories].map(([id, label]) => (
                  <Link key={id} to={categoryLink(id)} aria-current={category === id ? 'true' : undefined}>
                    {label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
          <p className="mt-6 text-sm text-moss" role="status">
            {products.length === 0
              ? 'No products are published to this storefront yet.'
              : `${results.length} ${results.length === 1 ? 'product' : 'products'}${results.length === 0 ? ' match your filters' : ''}`}
          </p>
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map(({ id, handle, title, featuredImage, priceRange, availableForSale }) => (
              <li key={id}>
                <Link
                  aria-label={title}
                  className="block h-full rounded-md hover:bg-oat/30 hover:[&_h2]:underline"
                  state={{ shopSearch: search }}
                  to={`/products/${encodeURIComponent(handle)}`}
                >
                  <ProductCard
                    title={title}
                    imageUrl={featuredImage?.url}
                    imageAlt={featuredImage?.altText}
                    price={priceRange.minVariantPrice.amount}
                    currency={priceRange.minVariantPrice.currencyCode}
                    maxPrice={priceRange.maxVariantPrice.amount}
                    soldOut={!availableForSale}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
