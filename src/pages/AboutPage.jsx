import { Link } from 'react-router'

export default function AboutPage() {
  return (
    <section className="page-width py-8 sm:py-12">
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-10">
        <h1 className="page-heading">About Circuit Harbor</h1>
        <p className="mt-5 max-w-[55ch] text-lg/relaxed text-muted">
          Circuit Harbor brings together phones, camera drones, audio, and desk gear for the way you work, play, and create.
        </p>
        <Link to="/shop" className="shop-action mt-6">Shop all tech</Link>
      </div>
    </section>
  )
}
