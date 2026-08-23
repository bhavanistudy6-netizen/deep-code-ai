import { useMemo } from "react";
import { cn } from "@/lib/utils";

const KEYWORDS =
  /\b(function|const|let|var|for|of|in|if|else|return|new|class|import|from|export|def|while|break|continue|null|true|false|this|await|async)\b/;

type Token = { text: string; kind: string };

function tokenize(line: string): Token[] {
  const pattern = new RegExp(
    [
      "(\\/\\/[^\\n]*|#[^\\n]*)",
      "('[^']*'|\"[^\"]*\"|`[^`]*`)",
      "\\b(\\d+(?:\\.\\d+)?)\\b",
      KEYWORDS.source,
      "([A-Za-z_$][\\w$]*)(?=\\()",
    ].join("|"),
    "g",
  );

  const tokens: Token[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(line)) !== null) {
    if (match.index > last) {
      tokens.push({ text: line.slice(last, match.index), kind: "plain" });
    }
    const kind = match[1]
      ? "comment"
      : match[2]
        ? "str"
        : match[3]
          ? "num"
          : match[4]
            ? "key"
            : "fn";
    tokens.push({ text: match[0], kind });
    last = match.index + match[0].length;
  }
  if (last < line.length) tokens.push({ text: line.slice(last), kind: "plain" });
  return tokens;
}

const KIND_CLASS: Record<string, string> = {
  comment: "text-code-comment italic",
  str: "text-code-str",
  num: "text-code-num",
  key: "text-code-key",
  fn: "text-code-fn",
  plain: "text-foreground/85",
};

export function CodeBlock({
  code,
  className,
  highlight = [],
  compact = false,
}: {
  code: string;
  className?: string;
  highlight?: number[];
  compact?: boolean;
}) {
  const lines = useMemo(() => code.replace(/\t/g, "    ").split("\n"), [code]);

  return (
    <div className={cn("gutter-rule overflow-x-auto bg-editor font-mono", className)}>
      <pre className={cn("min-w-max", compact ? "py-2.5 text-xs" : "py-4 text-[13px]")}>
        <code>
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "group flex leading-6 transition-colors",
                highlight.includes(i + 1)
                  ? "bg-primary/[0.12] shadow-[inset_2px_0_0_0_var(--brand)]"
                  : "hover:bg-foreground/[0.03]",
              )}
            >
              <span
                className={cn(
                  "w-11 shrink-0 select-none pr-4 text-right tabular-nums transition-colors",
                  highlight.includes(i + 1)
                    ? "text-primary/80"
                    : "text-muted-foreground/40 group-hover:text-muted-foreground/70",
                )}
              >
                {i + 1}
              </span>
              <span className="whitespace-pre pl-4 pr-6">
                {tokenize(line).map((token, j) => (
                  <span key={j} className={KIND_CLASS[token.kind]}>
                    {token.text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );

}
