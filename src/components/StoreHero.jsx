import { Link } from 'react-router'
import audioImage from '../assets/category-audio.jpg'
import deskImage from '../assets/category-desk-tech.jpg'
import dronesImage from '../assets/category-drones.jpg'
import phonesImage from '../assets/category-phones.jpg'
import heroImage from '../assets/technology-hero.jpg'

const categories = [
  { label: 'Phones', type: 'phones', image: phonesImage, description: 'Smartphones & foldables' },
  { label: 'Drones', type: 'drones', image: dronesImage, description: 'Camera drones & beginner kits' },
  { label: 'Audio', type: 'audio', image: audioImage, description: 'Headphones, earbuds & more' },
  { label: 'Desk tech', type: 'desk tech', image: deskImage, description: 'Keyboards, displays & hubs' },
]

export default function StoreHero() {
  return (
    <div className="page-width pt-4 pb-12 sm:pt-7 lg:pb-18">
      <section className="relative isolate grid overflow-hidden rounded-2xl bg-night text-white md:min-h-[clamp(25rem,36vw,34rem)]" aria-labelledby="hero-title">
        <div className="relative z-10 flex flex-col items-start justify-center px-5 pt-8 pb-4 sm:px-9 sm:pt-10 md:max-w-[57%] md:px-[clamp(2rem,4.3vw,4.5rem)] md:py-12">
          <h1 id="hero-title" className="font-display text-[clamp(2.8rem,10vw,5.25rem)] leading-[0.89] font-bold tracking-[-0.075em] md:text-[clamp(3.5rem,6.6vw,6.5rem)]">
            Tech for<br />
            <span className="text-volt">what’s next.</span>
          </h1>
          <p className="mt-5 max-w-[34ch] text-base leading-relaxed text-[#d7e2f8] sm:text-lg">
            Find your next phone, take to the skies, or upgrade your everyday setup.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
            <Link className="inline-flex min-h-12 items-center rounded-lg bg-volt px-4 text-sm font-bold text-night hover:bg-white focus-visible:outline-volt sm:px-5" to="/shop">
              Shop all tech
            </Link>
            <Link className="inline-flex min-h-12 items-center rounded-lg border border-white/40 px-4 text-sm font-semibold text-white hover:border-white hover:bg-white/10 focus-visible:outline-volt sm:px-5" to="/shop?category=drones">
              Browse drones
            </Link>
          </div>
        </div>
        <div className="relative aspect-[1.6] sm:aspect-[1.85] md:absolute md:inset-y-0 md:right-0 md:w-[72%] md:aspect-auto">
          <img
            className="size-full object-cover object-[58%_center]"
            src={heroImage}
            alt="A blue smartphone, a silver camera drone, and wireless earbuds"
            width={1536}
            height={1024}
            fetchPriority="high"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-b from-night to-transparent to-38% md:bg-linear-to-r md:to-52%" />
        </div>
      </section>

      <section className="mt-9 sm:mt-11" aria-labelledby="category-title">
        <h2 id="category-title" className="font-display text-3xl font-bold tracking-[-0.06em] sm:text-[2.55rem]">Shop by category</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {categories.map(({ label, type, image, description }) => (
            <Link
              key={type}
              to={`/shop?${new URLSearchParams({ category: type })}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface hover:border-brand"
            >
              <div className="aspect-[1.4] overflow-hidden bg-subtle sm:aspect-[1.65]">
                <img className="size-full object-cover motion-safe:transition-transform motion-safe:group-hover:scale-[1.04]" src={image} alt="" width={724} height={543} loading="lazy" />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-display text-lg leading-tight font-bold tracking-[-0.045em] group-hover:text-brand sm:text-xl">{label}</h3>
                <p className="mt-1 text-xs leading-snug text-muted sm:text-sm">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
