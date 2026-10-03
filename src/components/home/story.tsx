import { Droplet, Leaf, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { INGREDIENTS_STORY, RITUAL_STEPS } from "@/lib/content";

const RITUAL_ICONS = [Droplet, Sparkles, Leaf];

/** Ingredient story + three-step ritual. */
export function StorySection() {
  return (
    <>
      <section className="container-page grid gap-14 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-stone-light">
            Ingredient index
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Four botanicals, endlessly reworked
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-stone">
            We buy direct from growers across southern and western Africa, press within 48 hours of
            harvest and formulate in small weekly batches. Every jar names its source.
          </p>

          <ul className="mt-10 divide-y divide-clay/70">
            {INGREDIENTS_STORY.map((ingredient) => (
              <li key={ingredient.name} className="flex gap-5 py-5">
                <span className="w-24 shrink-0 font-display text-lg text-moss">
                  {ingredient.name}
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-stone-light">
                    {ingredient.origin}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-stone">
                    {ingredient.copy}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="grid gap-4 sm:grid-cols-2">
            {INGREDIENTS_STORY.map((ingredient, index) => (
              <div
                key={ingredient.name}
                className={
                  index % 3 === 0
                    ? "rounded-[28px] bg-moss-soft p-6"
                    : index % 3 === 1
                      ? "rounded-[28px] bg-rose-soft p-6"
                      : "rounded-[28px] bg-sand p-6"
                }
              >
                <p className="font-display text-2xl">{ingredient.name}</p>
                <p className="mt-2 text-xs uppercase tracking-wider text-stone-light">
                  {ingredient.origin}
                </p>
                <div className="mt-6 h-20 w-20 rounded-full border border-bark/10 bg-shell/70" />
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-stone-light">
            Illustrations only - the demo build uses no product photography.
          </p>
        </div>
      </section>

      <section className="bg-bark py-20 text-shell">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-shell/50">
              The three-step ritual
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Less product, more consistency
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-shell/70">
              A complete routine in three moves. Add a weekly mask when your skin asks for it, and
              keep SPF on in the morning.
            </p>
            <div className="mt-8">
              <LinkButton href="/shop" variant="inverse">
                Shop the ritual
              </LinkButton>
            </div>
          </div>

          <ol className="grid gap-6 sm:grid-cols-3">
            {RITUAL_STEPS.map((step, index) => {
              const Icon = RITUAL_ICONS[index % RITUAL_ICONS.length];
              return (
                <li
                  key={step.step}
                  className="rounded-[28px] border border-shell/12 bg-shell/5 p-6"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-shell/10">
                    <Icon size={19} />
                  </span>
                  <p className="mt-5 text-[11px] tracking-[0.3em] text-shell/45">{step.step}</p>
                  <p className="mt-2 font-display text-xl">{step.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-shell/70">{step.copy}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
