import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, SunMoon } from "lucide-react";
import { toast } from "sonner";
import { BrandLink, GitHubIcon } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { CodeEditorPanel } from "@/components/analyzer/CodeEditorPanel";
import { LevelSelector } from "@/components/analyzer/LevelSelector";
import {
  AnalysisEmptyState,
  AnalysisLoading,
  AnalysisTabs,
} from "@/components/analyzer/AnalysisTabs";
import { Footer } from "@/components/Footer";
import { LOADING_MESSAGES, SAMPLE_CODE, type Level } from "@/lib/analysis-data";

const TITLE = "Code Analyzer — ExplainMyCode AI";
const DESCRIPTION =
  "Paste code, pick your experience level, and get a quality score, complexity breakdown, bugs, code smells and an improved version.";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AnalyzePage;
});

function AnalyzePage() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState("JavaScript");
  const [level, setLevel] = useState<Level>("student");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [messageIndex, setMessageIndex] = useState(0);
  const [analyzedCode, setAnalyzedCode] = useState(SAMPLE_CODE);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const analyze = useCallback(() => {
    if (!code.trim()) {
      toast.error("Paste some code first");
      return;
    }
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setAnalyzedCode(code);
    setStatus("loading");
    setMessageIndex(0);

    LOADING_MESSAGES.forEach((_, i) => {
      if (i === 0) return;
      timers.current.push(setTimeout(() => setMessageIndex(i), i * 620));
    });
    timers.current.push(
      setTimeout(() => {
        setStatus("done");
        toast.success("Analysis ready");
      }, LOADING_MESSAGES.length * 620),
    );
  }, [code]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        analyze();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [analyze]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border glass">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 lg:grid-cols-3">
          <BrandLink />
          <p className="hidden text-center text-sm font-medium text-muted-foreground lg:block">
            Code Analyzer
          </p>
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => toast("Dark mode is the only mode for now.")}
            >
              <SunMoon />
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="GitHub repository">
              <a href="https://github.com">
                <GitHubIcon />
              </a>
            </Button>
            <span className="ml-1 grid size-8 shrink-0 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">
              DV
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-5">
            <CodeEditorPanel
              code={code}
              onCodeChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
            />
            <LevelSelector value={level} onChange={setLevel} />
            <div className="space-y-2">
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={analyze}
                disabled={status === "loading"}
              >
                <Sparkles />
                {status === "loading" ? "Analyzing..." : "Analyze My Code"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Tip: press{" "}
                <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]">
                  Ctrl + Enter
                </kbd>{" "}
                to analyze
              </p>
            </div>
          </section>

          <section className="min-w-0">
            {status === "idle" && <AnalysisEmptyState />}
            {status === "loading" && (
              <AnalysisLoading message={LOADING_MESSAGES[messageIndex]} />
            )}
            {status === "done" && (
              <AnalysisTabs level={level} originalCode={analyzedCode} />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
