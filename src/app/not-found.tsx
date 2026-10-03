import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.32em] text-stone-light">Error 404</p>
      <h1 className="mt-4 font-display text-4xl sm:text-5xl">This page has dried up</h1>
      <p className="mt-4 max-w-md text-sm text-stone">
        The page you are looking for has been moved, renamed or never existed. Our botanicals are
        still here though.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton href="/shop" variant="moss">
          Shop all products
        </LinkButton>
        <LinkButton href="/" variant="outline">
          Back home
        </LinkButton>
      </div>
    </section>
  );
}
