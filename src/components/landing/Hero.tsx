import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";
import { SAMPLE_CODE } from "@/lib/analysis-data";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute -left-24 top-10 size-[26rem] animate-float rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-40 size-[22rem] animate-float rounded-full bg-brand-2/20 blur-[120px] [animation-delay:2s]" />

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            AI code review, complexity & bug detection
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Understand Code <span className="text-gradient">Like Never Before.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Paste your code and get instant explanations, complexity analysis, bug
            detection, code smells, and AI-powered improvements.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="hero" size="xl" asChild className="w-full sm:w-auto">
              <Link to="/analyze">
                Analyze Your Code <ArrowRight />
              </Link>
            </Button>
            <Button variant="soft" size="xl" asChild className="w-full sm:w-auto">
              <a href="#examples">View Example</a>
            </Button>
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div className="panel overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="size-2.5 rounded-full bg-danger/70" />
              <span className="size-2.5 rounded-full bg-warning/70" />
              <span className="size-2.5 rounded-full bg-success/70" />
              <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
                findDuplicate.js
              </span>
            </div>
            <CodeBlock code={SAMPLE_CODE} highlight={[2, 3]} />
          </div>

          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Code Quality</p>
              <Sparkles className="size-4 text-primary" />
            </div>
            <p className="mt-2 font-mono text-5xl font-semibold">
              92<span className="text-xl text-muted-foreground">/100</span>
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full w-[92%] rounded-full bg-gradient-brand" />
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {["Clean structure", "Efficient algorithm"].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
              <li className="flex items-start gap-2.5">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
                <span className="text-foreground/90">Consider better error handling</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
