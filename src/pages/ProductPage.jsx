import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import ProductDetails from '../components/ProductDetails.jsx'
import { fetchProductByHandle } from '../lib/shopify.js'

function ProductPageContent({ handle }) {
  const { state } = useLocation()
  const [result, setResult] = useState({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [handle])

  useEffect(() => {
    const controller = new AbortController()

    async function loadProduct() {
      try {
        const product = await fetchProductByHandle(handle, controller.signal)
        if (!controller.signal.aborted) {
          setResult(product ? { status: 'ready', product } : { status: 'missing' })
        }
      } catch (error) {
        if (!controller.signal.aborted) setResult({ status: 'error', message: error.message })
      }
    }

    loadProduct()
    return () => controller.abort()
  }, [handle, attempt])

  function retry() {
    setResult({ status: 'loading' })
    setAttempt((value) => value + 1)
  }

  return (
    <div className="page-width py-8 sm:py-12">
      <Link className="mb-7 inline-block underline underline-offset-4" to={{ pathname: '/shop', search: state?.shopSearch }}>
        Back to shop
      </Link>
      {result.status === 'loading' && <p role="status">Loading product…</p>}
      {result.status === 'ready' && <ProductDetails product={result.product} />}
      {result.status === 'missing' && <h1 className="page-heading">Product not found</h1>}
      {result.status === 'error' && (
        <>
          <h1 className="page-heading">Unable to load product</h1>
          <p className="mt-4" role="alert">{result.message}</p>
          <button className="mt-3 min-h-11 underline underline-offset-4" onClick={retry} type="button">
            Try again
          </button>
        </>
      )}
    </div>
  )
}

export default function ProductPage() {
  const { handle } = useParams()
  return <ProductPageContent key={handle} handle={handle} />
}
