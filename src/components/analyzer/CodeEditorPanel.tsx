import { Eraser } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@/lib/analysis-data";
import { CodeBlock } from "@/components/CodeBlock";

export function CodeEditorPanel({
  code,
  onCodeChange,
  language,
  onLanguageChange,
}: {
  code: string;
  onCodeChange: (value: string) => void;
  language: string;
  onLanguageChange: (value: string) => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <div className="panel gradient-border overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-surface/40 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="hidden items-center gap-1.5 pr-1 sm:flex" aria-hidden>
            <span className="size-2.5 rounded-full bg-danger/70" />
            <span className="size-2.5 rounded-full bg-warning/70" />
            <span className="size-2.5 rounded-full bg-success/70" />
          </span>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="h-9 w-[150px] border-border bg-surface-2 text-sm transition-colors hover:border-primary/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="soft" size="sm" onClick={() => onCodeChange("")}>
          <Eraser />
          Clear Code
        </Button>
      </div>

      <div className="relative h-[340px] overflow-hidden bg-editor">
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <CodeBlock code={code || " "} className="min-h-full" />
        </div>
        <textarea
          value={code}
          spellCheck={false}
          onChange={(e) => onCodeChange(e.target.value)}
          onScroll={(e) => {
            if (overlayRef.current) {
              overlayRef.current.scrollTop = e.currentTarget.scrollTop;
              overlayRef.current.scrollLeft = e.currentTarget.scrollLeft;
            }
          }}
          placeholder="Paste your code here..."
          className="absolute inset-0 size-full resize-none bg-transparent py-4 pl-[60px] pr-6 font-mono text-[13px] leading-6 text-transparent caret-primary outline-none placeholder:text-muted-foreground/60 focus-visible:outline-none"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-editor to-transparent" />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border bg-surface/40 px-4 py-2 font-mono text-[11px] text-muted-foreground">
        <span className="truncate">{language}</span>
        <span className="flex shrink-0 items-center gap-3 tabular-nums">
          <span>{code.split("\n").length} lines</span>
          <span className="text-muted-foreground/40">•</span>
          <span>{code.length} chars</span>
          <span className="text-muted-foreground/40">•</span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success" />
            UTF-8
          </span>
        </span>
      </div>
    </div>
  );

}
