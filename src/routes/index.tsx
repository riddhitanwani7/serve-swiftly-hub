import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import {
  PortalCard, Pricing, Features, LiveDemo, HowItWorks,
  SocialProof, ContactCard, FinalCta, Footer,
} from "@/components/landing/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PaperlessPlates — QR Ordering, KDS & Analytics for Restaurants & Hotels" },
      {
        name: "description",
        content:
          "Go paperless. Serve faster. Earn more. PaperlessPlates is the all-in-one QR menu, real-time order management, kitchen display, and room service platform for restaurants and hotels.",
      },
      { property: "og:title", content: "PaperlessPlates — Modern QR Ordering Platform" },
      {
        property: "og:description",
        content:
          "QR-based digital menus, real-time order management, kitchen displays, analytics, and room service ordering — all in one platform.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <PortalCard />
        <Features />
        <LiveDemo />
        <HowItWorks />
        <Pricing />
        <SocialProof />
        <ContactCard />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
