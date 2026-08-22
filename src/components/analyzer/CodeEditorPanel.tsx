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
    <div className="panel overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="h-9 w-[150px] border-border bg-surface-2 text-sm">
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
          <span className="hidden truncate font-mono text-xs text-muted-foreground sm:block">
            {code.split("\n").length} lines
          </span>
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
          className="absolute inset-0 size-full resize-none bg-transparent py-4 pl-11 pr-6 font-mono text-[13px] leading-6 text-transparent caret-primary outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  );
}
