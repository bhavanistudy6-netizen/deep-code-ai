import { useState } from "react";
import {
  Bug,
  Check,
  ChevronDown,
  Columns2,
  Lightbulb,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CodeBlock } from "@/components/CodeBlock";
import { CopyButton } from "@/components/analyzer/CopyButton";
import { cn } from "@/lib/utils";
import {
  BUGS,
  COMPLEXITY,
  EXPLANATIONS,
  IMPROVED_CODE,
  IMPROVEMENTS,
  INTERVIEW_QUESTIONS,
  SCORES,
  SMELLS,
  type Level,
} from "@/lib/analysis-data";

const TABS = [
  "Overview",
  "Explanation",
  "Complexity",
  "Bugs",
  "Code Smells",
  "Improved Code",
  "Interview Mode",
];

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 52;
  return (
    <div className="relative grid size-[136px] shrink-0 place-items-center">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand)" />
            <stop offset="100%" stopColor="var(--brand-2)" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="52" fill="none" strokeWidth="9" className="stroke-surface-2" />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          stroke="url(#scoreGradient)"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-mono text-3xl font-semibold">{score}</p>
        <p className="text-xs text-muted-foreground">/ 100</p>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("panel p-5", className)}>
      {title && <h3 className="text-sm font-semibold">{title}</h3>}
      {children}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-4">
      <SectionCard className="flex flex-col items-center gap-6 sm:flex-row">
        <ScoreRing score={SCORES.overall} />
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">Code Quality Score</p>
          <p className="mt-1 text-xl font-semibold">Works correctly, scales poorly</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The logic is right and easy to read, but the quadratic scan is the single
            biggest thing holding this function back.
          </p>
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {SCORES.metrics.map((metric) => (
          <div key={metric.label} className="panel p-4">
            <p className="truncate text-xs text-muted-foreground">{metric.label}</p>
            <p className="mt-1 font-mono text-xl font-semibold">
              {metric.value}
              <span className="text-sm text-muted-foreground">/{metric.max}</span>
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gradient-brand transition-[width] duration-1000"
                style={{ width: `${(metric.value / metric.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <SectionCard title="Strengths">
          <ul className="mt-3 space-y-2.5 text-sm">
            {SCORES.strengths.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-success" />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Improvements">
          <ul className="mt-3 space-y-2.5 text-sm">
            {SCORES.improvements.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

function ExplanationTab({ level }: { level: Level }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {EXPLANATIONS.map((item, i) => (
        <div key={item.line} className="panel overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
            <Badge variant="secondary" className="font-mono text-xs">
              {item.line}
            </Badge>
            <code className="min-w-0 truncate font-mono text-xs text-code-fn">
              {item.code}
            </code>
          </div>
          <div className="p-4">
            <p className="text-sm leading-relaxed text-foreground/90">
              {item.text[level]}
            </p>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              Why does this matter?
              <ChevronDown
                className={cn("size-3.5 transition-transform", open === i && "rotate-180")}
              />
            </button>
            {open === i && (
              <p className="mt-3 animate-rise rounded-lg border border-border bg-surface-2/60 p-3 text-sm leading-relaxed text-muted-foreground">
                {item.why[level]}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ComplexityTab() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-2">
        {[COMPLEXITY.time, COMPLEXITY.space].map((item, i) => (
          <SectionCard key={item.value + i}>
            <p className="text-xs text-muted-foreground">
              {i === 0 ? "Time Complexity" : "Space Complexity"}
            </p>
            <p className="mt-1 font-mono text-4xl font-semibold text-gradient">
              {item.value}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.explanation}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gradient-brand transition-[width] duration-1000"
                  style={{ width: `${item.level}%` }}
                />
              </div>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {item.rating}
              </span>
            </div>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Operations as input grows">
        <div className="mt-4 space-y-3">
          {COMPLEXITY.growth.map((row) => (
            <div key={row.n} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">n={row.n}</span>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gradient-brand"
                  style={{ width: `${row.bar}%` }}
                />
              </div>
              <span className="font-mono text-xs text-foreground/80">{row.ops}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="panel border-primary/30 bg-primary/[0.07] p-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Lightbulb className="size-4 text-primary" />
          Optimization Opportunity
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {COMPLEXITY.optimization}
        </p>
      </div>
    </div>
  );
}

const SEVERITY_STYLE = {
  HIGH: "border-danger/40 bg-danger/15 text-danger",
  MEDIUM: "border-warning/40 bg-warning/15 text-warning",
  LOW: "border-brand-2/40 bg-brand-2/15 text-brand-2",
};

function BugsTab() {
  return (
    <div className="space-y-3">
      {BUGS.map((bug) => (
        <div key={bug.title} className="panel p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider",
                SEVERITY_STYLE[bug.severity],
              )}
            >
              {bug.severity}
            </span>
            <h3 className="min-w-0 text-sm font-semibold">{bug.title}</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {bug.description}
          </p>
          <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-border bg-surface-2/60 p-3">
            <Bug className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-foreground/90">
              <span className="font-medium">Suggested fix: </span>
              {bug.fix}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SmellsTab() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {SMELLS.map((smell) => (
        <div key={smell.name} className="panel glow-hover p-5">
          <p className="text-xs text-muted-foreground">Code Smell</p>
          <h3 className="mt-1 text-base font-semibold">{smell.name}</h3>
          <Badge variant="secondary" className="mt-3">
            Impact: {smell.impact}
          </Badge>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground/90">Suggestion: </span>
            {smell.suggestion}
          </p>
        </div>
      ))}
    </div>
  );
}

function ImprovedCodeTab({ originalCode }: { originalCode: string }) {
  const [compare, setCompare] = useState(false);

  return (
    <div className="space-y-4">
      <div className="panel overflow-hidden">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3">
          <p className="min-w-0 truncate font-mono text-xs text-muted-foreground">
            findDuplicate.optimized.js
          </p>
          <div className="flex items-center gap-2">
            <CopyButton value={IMPROVED_CODE} />
            <Button variant="soft" size="sm" onClick={() => setCompare(true)}>
              <Columns2 />
              Compare Versions
            </Button>
          </div>
        </div>
        <CodeBlock code={IMPROVED_CODE} />
      </div>

      <SectionCard title="Improvements Made:">
        <ul className="mt-3 space-y-2.5 text-sm">
          {IMPROVEMENTS.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <Dialog open={compare} onOpenChange={setCompare}>
        <DialogContent className="max-w-5xl border-border bg-surface">
          <DialogHeader>
            <DialogTitle>Compare Versions</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="panel overflow-hidden">
              <p className="border-b border-border px-4 py-2.5 font-mono text-xs text-muted-foreground">
                Original — O(n²)
              </p>
              <CodeBlock code={originalCode} compact />
            </div>
            <div className="panel overflow-hidden border-primary/30">
              <p className="border-b border-border px-4 py-2.5 font-mono text-xs text-primary">
                Improved — O(n)
              </p>
              <CodeBlock code={IMPROVED_CODE} compact />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InterviewTab() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Interview Questions Based on Your Code</h3>
      {INTERVIEW_QUESTIONS.map((item, i) => (
        <div key={item.question} className="panel overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-2/50"
          >
            <span className="min-w-0">
              <span className="block font-mono text-[11px] text-primary">
                Question {i + 1}
              </span>
              <span className="mt-1 block text-sm font-medium">{item.question}</span>
            </span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform",
                open === i && "rotate-180",
              )}
            />
          </button>
          {open === i && (
            <div className="animate-rise space-y-3 border-t border-border p-5">
              <div>
                <p className="text-xs font-semibold text-primary">Expected Answer</p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                  {item.answer}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface-2/60 p-3">
                <p className="text-xs font-semibold text-success">
                  What a Strong Candidate Should Mention
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.strong}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function AnalysisTabs({
  level,
  originalCode,
}: {
  level: Level;
  originalCode: string;
}) {
  return (
    <Tabs defaultValue="Overview" className="animate-rise">
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <TabsList className="h-auto w-max gap-1 rounded-xl border border-border bg-surface-2/50 p-1 shadow-[0_1px_0_0_oklch(1_0_0/5%)_inset]">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium tracking-tight text-muted-foreground transition-all duration-200 hover:text-foreground data-[state=active]:bg-gradient-brand data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_8px_20px_-10px_var(--brand)]"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="mt-5">

        <TabsContent value="Overview">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="Explanation">
          <ExplanationTab level={level} />
        </TabsContent>
        <TabsContent value="Complexity">
          <ComplexityTab />
        </TabsContent>
        <TabsContent value="Bugs">
          <BugsTab />
        </TabsContent>
        <TabsContent value="Code Smells">
          <SmellsTab />
        </TabsContent>
        <TabsContent value="Improved Code">
          <ImprovedCodeTab originalCode={originalCode} />
        </TabsContent>
        <TabsContent value="Interview Mode">
          <InterviewTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export function AnalysisEmptyState() {
  return (
    <div className="panel flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
      <span className="grid size-16 place-items-center rounded-2xl border border-border bg-surface-2">
        <Sparkles className="size-7 text-primary" />
      </span>
      <h3 className="mt-5 text-lg font-semibold">Ready to analyze your code</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Paste your code and click Analyze My Code.
      </p>
    </div>
  );
}

export function AnalysisLoading({ message }: { message: string }) {
  return (
    <div className="panel gradient-border min-h-[420px] p-6">
      <div className="flex items-center gap-3">
        <span className="relative grid size-2.5 place-items-center">
          <span className="absolute size-full animate-ping rounded-full bg-primary/50" />
          <span className="size-2.5 rounded-full bg-gradient-brand" />
        </span>
        <p key={message} className="animate-rise text-sm font-medium tracking-tight">
          {message}
        </p>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-surface-2">
        <div className="progress-indeterminate h-full w-full rounded-full bg-gradient-brand" />
      </div>
      <div className="mt-7 space-y-3">
        {[80, 100, 65, 92, 45, 100, 70].map((w, i) => (
          <div
            key={i}
            className="skeleton h-10 animate-rise"
            style={{ width: `${w}%`, animationDelay: `${i * 70}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

