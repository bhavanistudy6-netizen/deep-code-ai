import { Fragment } from "react";
import { LEVELS } from "@/lib/analysis-data";


const STEPS = [
  {
    n: "01",
    title: "Paste Your Code",
    body: "Drop in any function, file or snippet in eight languages.",
  },
  {
    n: "02",
    title: "Choose Your Level",
    body: "The same code, explained the way you need it.",
  },
  {
    n: "03",
    title: "Get Your Analysis",
    body: "Quality score, complexity, bugs, smells and improved code.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-20 border-y border-border bg-surface/30 py-20"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Three steps to a better codebase.
          </h2>
        </div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {STEPS.map((step, i) => (
            <Fragment key={step.n}>
              <div className="panel glow-hover p-6">

                <span className="font-mono text-xs text-primary">{step.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>

                {i === 1 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {LEVELS.map((level) => (
                      <span
                        key={level.id}
                        className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-foreground/85"
                      >
                        {level.emoji} {level.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="hidden self-center lg:block lg:h-0.5 lg:w-14 connector-line"
                  aria-hidden
                />
              )}
            </Fragment>

          ))}
        </div>
      </div>
    </section>
  );
}
