import { BestSellers } from "@/components/home/best-sellers";
import { CollectionGrid, ValueStrip } from "@/components/home/collections";
import { Hero } from "@/components/home/hero";
import { JournalTeasers, NewsletterBand, Testimonials } from "@/components/home/social-proof";
import { StorySection } from "@/components/home/story";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueStrip />
      <CollectionGrid />
      <BestSellers />
      <StorySection />
      <Testimonials />
      <JournalTeasers />
      <NewsletterBand />
    </>
  );
}
