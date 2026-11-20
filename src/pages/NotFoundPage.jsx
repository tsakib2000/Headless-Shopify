import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section className="page-width py-10 sm:py-14">
      <h1 className="page-heading">Page not found</h1>
      <Link className="mt-6 inline-block underline underline-offset-4" to="/">Back to home</Link>
    </section>
  )
}
