import { ArrowUpRight, Quote } from "lucide-react";
import Link from "next/link";
import { Stars } from "@/components/ui/stars";
import { JOURNAL_POSTS, TESTIMONIALS } from "@/lib/content";

export function Testimonials() {
  return (
    <section className="container-page py-20">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone-light">
          Verified reviews
        </p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">What skin says</h2>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex flex-col rounded-[28px] border border-clay/70 bg-shell p-7"
          >
            <Quote size={20} className="text-clay" />
            <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-bark-soft">
              {testimonial.quote}
            </blockquote>
            <figcaption className="mt-6 border-t border-clay/70 pt-5">
              <Stars rating={testimonial.rating} />
              <p className="mt-2 text-sm font-medium">
                {testimonial.name}
                <span className="font-normal text-stone"> · {testimonial.location}</span>
              </p>
              <p className="mt-0.5 text-xs text-stone-light">{testimonial.product}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function JournalTeasers() {
  return (
    <section className="container-page pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-stone-light">
            From the journal
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Skin school</h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-moss transition hover:text-moss-dark"
        >
          Read everything
          <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {JOURNAL_POSTS.map((post) => (
          <article
            key={post.title}
            className="group flex flex-col rounded-[28px] border border-clay/70 bg-sand/40 p-7 transition hover:border-moss/40 hover:bg-moss-soft/60"
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-stone-light">
              <span>{post.category}</span>
              <span className="h-1 w-1 rounded-full bg-stone-light" />
              <span>{post.readTime}</span>
            </div>
            <h3 className="mt-4 font-display text-xl leading-snug">{post.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-stone">{post.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs text-moss">
              Read the note
              <ArrowUpRight size={13} className="transition group-hover:translate-x-0.5" />
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function NewsletterBand() {
  return (
    <section className="container-page pb-8">
      <div className="relative overflow-hidden rounded-[36px] bg-moss-soft px-8 py-14 sm:px-14">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-shell/50 blur-2xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">
              Get 10% off your first ritual
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-bark-soft">
              Join the Belle Afrik list for restock alerts, ingredient deep dives and early access
              to launches. One email a fortnight, never more.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-bark-soft">
            <li>· First access to seasonal harvests</li>
            <li>· Skin school guides written by our formulators</li>
            <li>· Birthday refill on us</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
