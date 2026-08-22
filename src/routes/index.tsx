import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/Footer";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { IMPROVED_CODE, SAMPLE_CODE } from "@/lib/analysis-data";

const TITLE = "ExplainMyCode AI — Understand Code Like Never Before";
const DESCRIPTION =
  "Paste your code and get instant explanations, complexity analysis, bug detection, code smells, and AI-powered improvements.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Examples() {
  return (
    <section id="examples" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Examples
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          From O(n²) to O(n) in one review.
        </h2>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="panel overflow-hidden">
          <p className="border-b border-border px-4 py-3 font-mono text-xs text-muted-foreground">
            Before — quadratic scan
          </p>
          <CodeBlock code={SAMPLE_CODE} />
        </div>
        <div className="panel overflow-hidden border-primary/30">
          <p className="border-b border-border px-4 py-3 font-mono text-xs text-primary">
            After — linear with a Set
          </p>
          <CodeBlock code={IMPROVED_CODE} />
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button variant="hero" size="xl" asChild>
          <Link to="/analyze">
            Analyze Your Code <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Examples />
      </main>
      <Footer />
    </div>
  );
}
