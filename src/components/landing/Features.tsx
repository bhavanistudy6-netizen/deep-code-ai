import {
  Bug,
  Gauge,
  ListTree,
  MessagesSquare,
  Sparkles,
  Wind,
  type LucideIcon,
} from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ListTree,
    title: "Line-by-Line Explanation",
    body: "Understand exactly what every part of your code does.",
  },
  {
    icon: Gauge,
    title: "Complexity Analysis",
    body: "Automatically analyze time and space complexity.",
  },
  {
    icon: Bug,
    title: "Bug Detection",
    body: "Identify possible errors and risky code patterns.",
  },
  {
    icon: Wind,
    title: "Code Smells",
    body: "Discover maintainability and readability problems.",
  },
  {
    icon: Sparkles,
    title: "Better Code",
    body: "Get an improved version of your code.",
  },
  {
    icon: MessagesSquare,
    title: "Explain Your Way",
    body: "Choose how you want the explanation delivered.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Features
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything a reviewer would tell you — instantly.
        </h2>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <article key={title} className="panel glow-hover group p-6">
            <span className="grid size-11 place-items-center rounded-xl border border-border bg-surface-2 transition-colors group-hover:border-primary/40">
              <Icon className="size-5 text-primary" />
            </span>
            <h3 className="mt-5 text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
