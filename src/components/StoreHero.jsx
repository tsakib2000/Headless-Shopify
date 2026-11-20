import { Link } from 'react-router'
import everydayCarry from '../assets/everyday-carry.jpg'

const featuredCategories = [
  { id: 'bags', label: 'Bags' },
  { id: 'headwear', label: 'Headwear' },
  { id: 'drinkware', label: 'Drinkware' },
]

export default function StoreHero() {
  return (
    <section className="page-width pt-5 pb-10 sm:pt-8 lg:pt-10" aria-labelledby="hero-title">
      <div className="grid overflow-hidden rounded-lg bg-forest text-paper md:grid-cols-[0.91fr_1.09fr]">
        <div className="flex min-h-[24rem] flex-col items-start justify-center px-[clamp(1.4rem,4.2vw,4.5rem)] py-10 md:min-h-[34rem] lg:min-h-[37rem]">
          <p className="eyebrow mb-5 flex items-center gap-3 text-gold sm:mb-7">
            <span className="h-px w-6 shrink-0 bg-current" aria-hidden="true" />
            The Everyday Carry Collection
          </p>
          <h1 id="hero-title" className="font-display text-[clamp(2.8rem,8.7vw,5.6rem)] leading-[0.98] tracking-[-0.065em] md:text-[clamp(3.1rem,6vw,6rem)]">
            Good gear.<br /><em className="text-gold">Better days.</em>
          </h1>
          <p className="mt-6 max-w-[31ch] text-base leading-[1.65] text-oat sm:text-lg">
            Canvas bags, easy-wearing caps, and drinkware for the morning commute and the long way home.
          </p>
          <Link
            className="mt-7 inline-flex min-h-12 items-center rounded-sm bg-gold px-5 text-sm font-semibold text-forest transition-colors hover:bg-paper focus-visible:outline-gold motion-reduce:transition-none sm:mt-9 sm:px-6"
            to="/shop"
          >
            Shop all products
          </Link>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#a26522] sm:aspect-[3/2] md:aspect-auto">
          <img
            className="absolute inset-0 size-full object-cover object-[54%_center]"
            src={everydayCarry}
            alt="Canvas utility tote, olive cap, and stainless steel tumbler in warm sunlight"
            width={1536}
            height={1024}
            fetchPriority="high"
          />
        </div>
      </div>

      <nav className="mt-5 grid grid-cols-3 items-center rounded-md border border-line sm:grid-cols-[1.15fr_repeat(3,1fr)]" aria-label="Shop by category">
        <span className="eyebrow col-span-3 border-b border-line px-4 py-3.5 text-moss sm:col-span-1 sm:border-0 sm:px-5">Shop by category</span>
        {featuredCategories.map(({ id, label }, index) => (
          <Link
            key={id}
            to={`/shop?category=${id}`}
            className={`flex min-h-14 items-center justify-center px-2 font-display text-[clamp(1rem,2.1vw,1.5rem)] transition-colors hover:bg-oat focus-visible:-outline-offset-4 motion-reduce:transition-none sm:min-h-[4.5rem] ${index === 0 ? 'sm:border-l sm:border-line' : 'border-l border-line'}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </section>
  )
}
