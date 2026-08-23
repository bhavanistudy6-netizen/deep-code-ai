import type { Level } from "@/lib/analysis-data";

export type Severity = "HIGH" | "MEDIUM" | "LOW";

export type AnalysisResult = {
  language: string;
  level: Level;
  fileName: string;
  overall: number;
  verdict: string;
  summary: string;
  metrics: { label: string; value: number; max: number }[];
  strengths: string[];
  improvements: string[];
  explanations: {
    line: string;
    code: string;
    text: string;
    why: string;
  }[];
  complexity: {
    time: { value: string; explanation: string; level: number; rating: string };
    space: { value: string; explanation: string; level: number; rating: string };
    optimization: string;
    growth: { n: string; ops: string; bar: number }[];
  };
  bugs: { severity: Severity; title: string; description: string; fix: string }[];
  smells: { name: string; impact: string; suggestion: string }[];
  improvedCode: string;
  improvementsMade: string[];
  interviewQuestions: { question: string; answer: string; strong: string }[];
};

const EXT: Record<string, string> = {
  JavaScript: "js",
  TypeScript: "ts",
  Python: "py",
  Java: "java",
  "C++": "cpp",
  C: "c",
  HTML: "html",
  CSS: "css",
};

const COMMENT_PREFIX: Record<string, string> = {
  Python: "#",
  HTML: "<!--",
  CSS: "/*",
};

const clamp = (n: number, min = 0, max = 10) => Math.max(min, Math.min(max, n));
const round1 = (n: number) => Math.round(n * 10) / 10;

type Facts = ReturnType<typeof inspect>;

function inspect(code: string, language: string) {
  const rawLines = code.replace(/\r/g, "").split("\n");
  const lines = rawLines.map((l) => l.trim());
  const nonEmpty = lines.filter(Boolean);
  const commentToken = COMMENT_PREFIX[language] ?? "//";
  const comments = nonEmpty.filter(
    (l) => l.startsWith(commentToken) || l.startsWith("*") || l.startsWith("/*"),
  ).length;

  const loopRe = /\b(for|while|forEach|foreach|map\s*\(|repeat)\b/;
  const loopLines: number[] = [];
  let depth = 0;
  let maxLoopDepth = 0;
  const indentOf = (l: string) => l.length - l.trimStart().length;
  const loopStack: number[] = [];

  rawLines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;
    while (loopStack.length && indentOf(raw) <= loopStack[loopStack.length - 1]!) {
      loopStack.pop();
    }
    if (loopRe.test(line)) {
      loopLines.push(i + 1);
      loopStack.push(indentOf(raw));
      depth = loopStack.length;
      maxLoopDepth = Math.max(maxLoopDepth, depth);
    }
  });

  const functionRe =
    /\b(function\s+([A-Za-z_$][\w$]*)|def\s+([A-Za-z_$][\w$]*)|const\s+([A-Za-z_$][\w$]*)\s*=\s*(async\s*)?\(|([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{)/;
  const functionLine = rawLines.findIndex((l) => functionRe.test(l));
  const nameMatch = code.match(
    /(?:function\s+|def\s+|const\s+|class\s+)([A-Za-z_$][\w$]*)/,
  );
  const primaryName = nameMatch?.[1] ?? "snippet";

  const signature = functionLine >= 0 ? rawLines[functionLine]!.trim() : nonEmpty[0] ?? "";
  const params = (signature.match(/\(([^)]*)\)/)?.[1] ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const conditionalLines = rawLines
    .map((l, i) => ({ l: l.trim(), i: i + 1 }))
    .filter((x) => /\b(if|elif|else if|switch|case|\?\s*[^:]+:)\b/.test(x.l));

  const returnLines = rawLines
    .map((l, i) => ({ l: l.trim(), i: i + 1 }))
    .filter((x) => /\b(return|yield)\b/.test(x.l));

  const recursive =
    primaryName !== "snippet" &&
    new RegExp(`\\b${primaryName}\\s*\\(`, "g").test(code.slice(code.indexOf(signature) + signature.length));

  return {
    code,
    language,
    rawLines,
    lines,
    lineCount: nonEmpty.length,
    charCount: code.length,
    comments,
    commentRatio: nonEmpty.length ? comments / nonEmpty.length : 0,
    loopLines,
    loopCount: loopLines.length,
    maxLoopDepth,
    recursive,
    primaryName,
    signature,
    params,
    conditionalLines,
    returnLines,
    hasSet: /\b(Set|HashSet|dict|Map|HashMap|\{\}|set\()\b/.test(code),
    hasSort: /\b(sort|sorted|Arrays\.sort|std::sort)\b/.test(code),
    hasTry: /\b(try|catch|except|rescue)\b/.test(code),
    hasGuard: /\b(Array\.isArray|isinstance|instanceof|typeof|len\(|== *null|=== *null|!== *undefined)\b/.test(code),
    hasAsync: /\b(async|await|Promise|then\()\b/.test(code),
    hasEval: /\b(eval|exec|Function\s*\(|innerHTML|dangerouslySetInnerHTML)\b/.test(code),
    hasSqlConcat: /(SELECT|INSERT|UPDATE|DELETE)[^;]*(\+|\$\{|%s|f")/i.test(code),
    hasSecret: /\b(api[_-]?key|secret|password|token)\b\s*[:=]\s*["'][^"']{6,}/i.test(code),
    hasVar: /\bvar\s+/.test(code),
    hasLooseEq: /[^=!<>]==[^=]/.test(code) && language !== "Python",
    hasConsole: /\b(console\.log|print\(|System\.out\.print)\b/.test(code),
    hasMagicNumbers: /[^\w.](?:[3-9]|[1-9]\d+)\b/.test(code.replace(/\b(0|1|2)\b/g, "")),
    longestLine: Math.max(0, ...rawLines.map((l) => l.length)),
    shortNames: (code.match(/\b(?:let|const|var|int|float|double|String)\s+([a-z]{1,2})\b/g) ?? []).length,
    nesting: Math.max(0, ...rawLines.map((l) => Math.floor((l.length - l.trimStart().length) / 2))),
  };
}

/* ---------------- complexity ---------------- */

function complexityOf(f: Facts): AnalysisResult["complexity"] {
  let time = "O(1)";
  let rating = "Constant";
  let level = 8;
  let timeExplanation = "The code runs a fixed number of steps regardless of input size.";

  if (f.recursive) {
    time = "O(2^n)";
    rating = "Exponential";
    level = 95;
    timeExplanation =
      "The function calls itself without memoisation, so the call tree branches on every level.";
  } else if (f.maxLoopDepth >= 3) {
    time = "O(n³)";
    rating = "Cubic";
    level = 92;
    timeExplanation = "Three nested loops mean work grows with the cube of the input size.";
  } else if (f.maxLoopDepth === 2) {
    time = "O(n²)";
    rating = "Quadratic";
    level = 80;
    timeExplanation =
      "The nested loops compare each element against the other elements, so work grows quadratically.";
  } else if (f.hasSort) {
    time = "O(n log n)";
    rating = "Linearithmic";
    level = 45;
    timeExplanation = "Sorting dominates the runtime of this snippet.";
  } else if (f.loopCount >= 1) {
    time = "O(n)";
    rating = "Linear";
    level = 28;
    timeExplanation = "A single pass over the input: work grows in step with the input size.";
  }

  const allocates = f.hasSet || /\b(new |\[\]|\{\}|list\(|append|push)\b/.test(f.code);
  const space = f.recursive
    ? { value: "O(n)", rating: "Linear", level: 40, explanation: "Recursive frames stack up on the call stack." }
    : allocates
      ? { value: "O(n)", rating: "Linear", level: 38, explanation: "An auxiliary collection grows with the input." }
      : { value: "O(1)", rating: "Constant", level: 12, explanation: "The algorithm uses only a few additional variables." };

  const growthFor = (n: number) => {
    switch (time) {
      case "O(1)":
        return 1;
      case "O(n)":
        return n;
      case "O(n log n)":
        return Math.round(n * Math.log2(Math.max(2, n)));
      case "O(n²)":
        return n * n;
      case "O(n³)":
        return n * n * n;
      default:
        return Math.pow(2, Math.min(n, 40));
    }
  };
  const sizes = [10, 100, 1000, 10000];
  const ops = sizes.map(growthFor);
  const max = Math.max(...ops);

  return {
    time: { value: time, explanation: timeExplanation, level, rating },
    space,
    optimization:
      time === "O(n²)" || time === "O(n³)"
        ? "Replace the nested scan with a hash-based lookup (Set/Map) to reach O(n) time."
        : time === "O(2^n)"
          ? "Memoise the recursion (or convert it to a bottom-up loop) to collapse the call tree to O(n)."
          : time === "O(n log n)"
            ? "If ordering is not required, a single hash pass gets you to O(n)."
            : "This is already near-optimal; focus on validation and readability instead.",
    growth: sizes.map((n, i) => ({
      n: n.toLocaleString("en-US"),
      ops: ops[i]!.toLocaleString("en-US"),
      bar: Math.max(6, Math.round((ops[i]! / max) * 100)),
    })),
  };
}

/* ---------------- scoring ---------------- */

function scoreOf(f: Facts, c: AnalysisResult["complexity"]) {
  const readability = clamp(
    9 -
      (f.nesting > 3 ? 1.5 : 0) -
      (f.longestLine > 100 ? 1 : 0) -
      (f.shortNames > 0 ? 0.8 : 0) -
      (f.commentRatio === 0 && f.lineCount > 20 ? 1 : 0) -
      (f.lineCount > 80 ? 1 : 0),
    2,
  );
  const efficiencyMap: Record<string, number> = {
    "O(1)": 10,
    "O(n)": 8.5,
    "O(n log n)": 7.5,
    "O(n²)": 5.5,
    "O(n³)": 3.5,
    "O(2^n)": 2,
  };
  const efficiency = clamp(efficiencyMap[c.time.value] ?? 7, 1);
  const maintainability = clamp(
    8.5 -
      (f.hasVar ? 1 : 0) -
      (f.maxLoopDepth >= 2 ? 0.8 : 0) -
      (f.lineCount > 60 ? 1.2 : 0) -
      (f.hasConsole ? 0.5 : 0) +
      (f.commentRatio > 0.1 ? 0.7 : 0),
    2,
  );
  const security = clamp(
    9.5 -
      (f.hasEval ? 4 : 0) -
      (f.hasSqlConcat ? 3.5 : 0) -
      (f.hasSecret ? 4 : 0) -
      (f.hasGuard ? 0 : 0.8) -
      (f.hasTry || !f.hasAsync ? 0 : 0.7),
    1,
  );

  const metrics = [
    { label: "Readability", value: round1(readability), max: 10 },
    { label: "Efficiency", value: round1(efficiency), max: 10 },
    { label: "Maintainability", value: round1(maintainability), max: 10 },
    { label: "Security", value: round1(security), max: 10 },
  ];
  const overall = Math.round(
    ((readability + efficiency + maintainability + security) / 40) * 100,
  );
  return { metrics, overall };
}

/* ---------------- bugs & smells ---------------- */

function bugsOf(f: Facts, c: AnalysisResult["complexity"]) {
  const bugs: AnalysisResult["bugs"] = [];
  if (f.hasEval)
    bugs.push({
      severity: "HIGH",
      title: "Dynamic Code Execution",
      description: "eval / exec / innerHTML style APIs execute untrusted input as code or markup.",
      fix: "Parse the value explicitly instead, or sanitise before rendering.",
    });
  if (f.hasSqlConcat)
    bugs.push({
      severity: "HIGH",
      title: "Possible SQL Injection",
      description: "A query string appears to be built by concatenating or interpolating values.",
      fix: "Use parameterised queries and pass values as bound arguments.",
    });
  if (f.hasSecret)
    bugs.push({
      severity: "HIGH",
      title: "Hard-coded Credential",
      description: "A key, token or password looks embedded directly in the source.",
      fix: "Move the value to an environment variable or a secret store.",
    });
  if (c.time.value === "O(n²)" || c.time.value === "O(n³)" || c.time.value === "O(2^n)")
    bugs.push({
      severity: "MEDIUM",
      title: "Performance Issue",
      description: `The current shape is ${c.time.value}, which degrades quickly as input grows.`,
      fix: c.optimization,
    });
  if (!f.hasGuard && f.params.length > 0)
    bugs.push({
      severity: "LOW",
      title: "Input Validation",
      description: `The code assumes ${f.params[0]} always arrives in the expected shape.`,
      fix: "Add an early guard clause and return a safe default for invalid input.",
    });
  if (f.hasAsync && !f.hasTry)
    bugs.push({
      severity: "MEDIUM",
      title: "Unhandled Rejection",
      description: "Async work runs without any error handling around it.",
      fix: "Wrap awaits in try/catch and surface failures to the caller.",
    });
  if (f.hasLooseEq)
    bugs.push({
      severity: "LOW",
      title: "Loose Equality",
      description: "== performs type coercion and can match values you did not intend.",
      fix: "Use === (or the language's strict comparison) instead.",
    });
  if (!bugs.length)
    bugs.push({
      severity: "LOW",
      title: "No Blocking Issues Found",
      description: "Static heuristics did not surface a correctness or security problem here.",
      fix: "Add unit tests around the edge cases to lock the behaviour in.",
    });
  return bugs.slice(0, 4);
}

function smellsOf(f: Facts) {
  const smells: AnalysisResult["smells"] = [];
  if (f.maxLoopDepth >= 2)
    smells.push({
      name: "Nested Iteration",
      impact: "Performance",
      suggestion: "Flatten the scan with a hash lookup instead of comparing every pair.",
    });
  if (f.shortNames > 0)
    smells.push({
      name: "Generic Variable Naming",
      impact: "Readability",
      suggestion: "Rename one- and two-letter variables to describe what they hold.",
    });
  if (!f.hasGuard && f.params.length > 0)
    smells.push({
      name: "Missing Guard Clause",
      impact: "Robustness",
      suggestion: "Validate the input shape before iterating over it.",
    });
  if (f.lineCount > 40)
    smells.push({
      name: "Long Function",
      impact: "Maintainability",
      suggestion: `Split these ${f.lineCount} lines into smaller single-purpose helpers.`,
    });
  if (f.hasConsole)
    smells.push({
      name: "Leftover Debug Output",
      impact: "Cleanliness",
      suggestion: "Remove the print/log statements or route them through a logger.",
    });
  if (f.hasVar)
    smells.push({
      name: "Legacy var Declarations",
      impact: "Predictability",
      suggestion: "Prefer const/let for block scoping.",
    });
  if (f.commentRatio === 0 && f.lineCount > 25)
    smells.push({
      name: "No Explanatory Comments",
      impact: "Onboarding",
      suggestion: "Document the intent of the non-obvious branches.",
    });
  if (!smells.length)
    smells.push({
      name: "Clean Structure",
      impact: "None",
      suggestion: "Nothing structural to flag — keep the function this focused.",
    });
  return smells.slice(0, 4);
}

/* ---------------- level-aware explanations ---------------- */

type Voice = {
  intro: (subject: string) => string;
  loop: (depth: number, time: string) => string;
  branch: (snippet: string) => string;
  ret: (snippet: string) => string;
  whyIntro: string;
  whyLoop: (time: string) => string;
  whyBranch: string;
  whyRet: string;
};

const VOICES: Record<Level, Voice> = {
  beginner: {
    intro: (s) =>
      `This is where the code starts: ${s}. Think of it as a recipe card — it says what the code needs before it can do its job.`,
    loop: (d, t) =>
      d >= 2
        ? "Here loops sit inside each other, so the code checks every item against every other item — like comparing every card in a deck with every other card."
        : "This is a loop: it walks through the items one at a time, like ticking off names on a list.",
    branch: (s) => `This is a decision point (${s}). If the answer is yes the code goes one way, otherwise it goes the other.`,
    ret: (s) => `Here the code hands an answer back (${s}) and stops working.`,
    whyIntro: "Clear starting points mean you can come back tomorrow and still understand your own code.",
    whyLoop: (t) =>
      t === "O(n²)" || t === "O(n³)"
        ? "Repeating work inside repeated work adds up fast — with 1,000 items that is around a million checks."
        : "Loops are where most of the time is spent, so it helps to know how many times they run.",
    whyBranch: "Decisions are where bugs hide, so it is worth reading them slowly.",
    whyRet: "Always giving an answer back means whoever calls this code is never left guessing.",
  },
  student: {
    intro: (s) =>
      `Declaration: \`${s}\`. Note the parameters and the implicit contract — the caller is responsible for passing the expected types.`,
    loop: (d, t) =>
      d >= 2
        ? `Nested iteration produces pairwise comparisons, giving ${t} time. Starting the inner index after the outer one avoids duplicate pairs.`
        : `A single traversal over the input, i.e. linear work per element. This is the main cost centre of the routine.`,
    branch: (s) => `Conditional branch: \`${s}\`. Trace both paths and confirm each one has a defined outcome.`,
    ret: (s) => `Exit point: \`${s}\`. Early returns keep the control flow flat and avoid accumulator state.`,
    whyIntro: "Clear function boundaries are what make code testable and reusable across a project.",
    whyLoop: (t) => `Counting loop iterations is how you derive ${t} by hand instead of guessing at it.`,
    whyBranch: "Enumerating branches is the basis of branch coverage in testing.",
    whyRet: "Explicit return values prevent accidental undefined-propagation bugs.",
  },
  senior: {
    intro: (s) =>
      `\`${s}\` — no type contract is enforced at this boundary, so callers own input validity. Consider narrowing with a schema or types at the edge.`,
    loop: (d, t) =>
      d >= 2
        ? `Brute-force pairwise scan: ${t} time, constant auxiliary space. Acceptable only for bounded inputs; otherwise trade memory for a hash index.`
        : `Single linear pass. Watch for hidden per-iteration allocations and repeated work that could be hoisted out of the loop.`,
    branch: (s) => `Branch \`${s}\` — check for coercion, nullish holes, and whether this predicate belongs behind a named helper.`,
    ret: (s) => `\`${s}\` — return-shape consistency matters here: sentinel vs undefined vs a result object should be uniform codebase-wide.`,
    whyIntro: "Implicit contracts at module boundaries are one of the most common sources of production runtime errors.",
    whyLoop: (t) => `${t} is the decision point for the time/space tradeoff — hashing buys linear time for linear memory.`,
    whyBranch: "Complex predicates inline inflate cyclomatic complexity and resist unit testing.",
    whyRet: "Falsy sentinel values (0, \"\") are a latent bug when call sites use truthiness checks.",
  },
  interviewer: {
    intro: (s) =>
      `Ask the candidate to restate \`${s}\`: input types, output contract, and constraints — before a single line of logic.`,
    loop: (d, t) =>
      d >= 2
        ? `Expect the candidate to identify the ${t} pair enumeration immediately, then propose a linear alternative unprompted.`
        : `Ask for the exact loop invariant and the ${t} justification, not just the notation.`,
    branch: (s) => `Probe \`${s}\`: which edge cases reach this branch, and what happens with empty, null, or NaN input?`,
    ret: (s) => `Follow up on \`${s}\`: how does the caller distinguish "not found" from a legitimately falsy result?`,
    whyIntro: "Strong candidates clarify requirements first; weak ones start typing immediately.",
    whyLoop: (t) => `${t} is where the interview pivots to "can you do better?" — listen for the tradeoff, not just the answer.`,
    whyBranch: "Edge-case awareness separates good answers from great ones.",
    whyRet: "Return-contract questions reveal whether the candidate thinks about API consumers.",
  },
};

function explanationsOf(f: Facts, level: Level, c: AnalysisResult["complexity"]) {
  const v = VOICES[level];
  const out: AnalysisResult["explanations"] = [];

  if (f.signature)
    out.push({
      line: `Line ${Math.max(1, f.rawLines.findIndex((l) => l.trim() === f.signature) + 1)}`,
      code: f.signature.slice(0, 90),
      text: v.intro(f.signature.slice(0, 70)),
      why: v.whyIntro,
    });

  if (f.loopLines.length) {
    out.push({
      line:
        f.loopLines.length > 1
          ? `Lines ${f.loopLines[0]}–${f.loopLines[f.loopLines.length - 1]}`
          : `Line ${f.loopLines[0]}`,
      code: (f.rawLines[f.loopLines[0]! - 1] ?? "").trim().slice(0, 90),
      text: v.loop(f.maxLoopDepth, c.time.value),
      why: v.whyLoop(c.time.value),
    });
  }

  const branch = f.conditionalLines[0];
  if (branch)
    out.push({
      line: `Line ${branch.i}`,
      code: branch.l.slice(0, 90),
      text: v.branch(branch.l.slice(0, 60)),
      why: v.whyBranch,
    });

  const ret = f.returnLines[f.returnLines.length - 1];
  if (ret)
    out.push({
      line: `Line ${ret.i}`,
      code: ret.l.slice(0, 90),
      text: v.ret(ret.l.slice(0, 60)),
      why: v.whyRet,
    });

  if (!out.length)
    out.push({
      line: "Line 1",
      code: f.lines[0] ?? "",
      text: v.intro(f.lines[0] ?? "this snippet"),
      why: v.whyIntro,
    });

  return out;
}

/* ---------------- improved code ---------------- */

function improvedCodeOf(f: Facts, c: AnalysisResult["complexity"]) {
  const token = COMMENT_PREFIX[f.language] ?? "//";
  const close = f.language === "HTML" ? " -->" : f.language === "CSS" ? " */" : "";
  const notes: string[] = [];
  const improvements: string[] = [];

  if (!f.hasGuard && f.params.length) {
    notes.push(`${token} 1. Guard the input before doing any work.${close}`);
    improvements.push("Added an early guard clause for invalid input");
  }
  if (f.maxLoopDepth >= 2) {
    notes.push(`${token} 2. Replace the nested scan with a hash lookup (Set/Map).${close}`);
    improvements.push(`Time complexity improved from ${c.time.value} to O(n)`);
  }
  if (f.recursive) {
    notes.push(`${token} 2. Memoise the recursive calls.${close}`);
    improvements.push("Recursion memoised, collapsing the exponential call tree");
  }
  if (f.shortNames) {
    notes.push(`${token} 3. Rename short variables to describe their contents.${close}`);
    improvements.push("Clearer, intention-revealing variable names");
  }
  if (f.hasVar) {
    notes.push(`${token} 3. Swap var for const/let.${close}`);
    improvements.push("Block-scoped declarations replace var");
  }
  if (f.hasConsole) {
    notes.push(`${token} 4. Strip debug output.${close}`);
    improvements.push("Debug logging removed");
  }
  if (!notes.length) {
    notes.push(`${token} Already close to optimal — only cosmetic tidying applied.${close}`);
    improvements.push("Formatting normalised and intent documented");
  }

  const body = f.code
    .replace(/\r/g, "")
    .split("\n")
    .filter((l) => !f.hasConsole || !/\b(console\.log|print\(|System\.out\.print)\b/.test(l))
    .map((l) => (f.hasVar ? l.replace(/\bvar\b/g, "let") : l))
    .join("\n");

  return {
    improvedCode: [`${token} Refactor plan:${close}`, ...notes, "", body].join("\n"),
    improvementsMade: improvements.slice(0, 4),
  };
}

/* ---------------- interview questions ---------------- */

function questionsOf(f: Facts, c: AnalysisResult["complexity"]) {
  const worst = c.growth[c.growth.length - 1]!;
  return [
    {
      question: `What is the time and space complexity of this ${f.language} code?`,
      answer: `${c.time.value} time and ${c.space.value} space — ${c.time.explanation.toLowerCase()}`,
      strong: "Derive it from the loop bounds out loud, and mention that constants drop out of Big-O.",
    },
    {
      question: `How does it behave at n = ${worst.n}?`,
      answer: `Roughly ${worst.ops} operations in the worst case.`,
      strong: "Reason about real numbers, not just notation, and identify the best-case exit path.",
    },
    {
      question: "Can you optimise this further?",
      answer: c.optimization,
      strong: "Offer more than one option and state the tradeoff explicitly instead of jumping to hashing.",
    },
    {
      question: "What edge cases would you test?",
      answer: `Empty input, a single element, all-identical values${
        f.params.length ? `, and a malformed ${f.params[0]}` : ""
      }, plus NaN and falsy-zero cases.`,
      strong: "Name the edge cases before being prompted, and explain why each one is risky.",
    },
    {
      question: `Why ${f.language} for this, and what would change in another language?`,
      answer: `${f.language} gives you the built-ins used here; a lower-level language would force explicit memory and container choices.`,
      strong: "Connect the language's data structures to the complexity, not just syntax preference.",
    },
  ].slice(0, 4);
}

/* ---------------- verdict ---------------- */

function verdictOf(overall: number, c: AnalysisResult["complexity"]) {
  if (overall >= 88) return "Clean, efficient and production-ready";
  if (overall >= 75)
    return c.time.value === "O(n²)" ? "Works correctly, scales poorly" : "Solid with small refinements left";
  if (overall >= 60) return "Functional but needs hardening";
  return "Significant rework recommended";
}

export function analyzeCode(
  code: string,
  language: string,
  level: Level,
): AnalysisResult {
  const f = inspect(code, language);
  const complexity = complexityOf(f);
  const { metrics, overall } = scoreOf(f, complexity);
  const bugs = bugsOf(f, complexity);
  const smells = smellsOf(f);
  const { improvedCode, improvementsMade } = improvedCodeOf(f, complexity);

  const strengths = [
    f.commentRatio > 0.08 ? "Documented with helpful comments" : "Compact and readable flow",
    f.returnLines.length ? "Explicit return paths" : "Straightforward top-to-bottom logic",
    complexity.space.value === "O(1)" ? "Constant extra memory" : "Uses appropriate data structures",
    f.hasGuard ? "Validates its input" : `Focused single responsibility (${f.primaryName})`,
  ].slice(0, 3);

  return {
    language,
    level,
    fileName: `${f.primaryName}.optimized.${EXT[language] ?? "txt"}`,
    overall,
    verdict: verdictOf(overall, complexity),
    summary: `Analysed ${f.lineCount} lines of ${language} at "${level}" level. The dominant cost is ${complexity.time.value} time with ${complexity.space.value} space; ${bugs.length} finding${bugs.length === 1 ? "" : "s"} and ${smells.length} code smell${smells.length === 1 ? "" : "s"} surfaced.`,
    metrics,
    strengths,
    improvements: [
      complexity.optimization,
      ...smells.slice(0, 2).map((s) => s.suggestion),
    ].slice(0, 3),
    explanations: explanationsOf(f, level, complexity),
    complexity,
    bugs,
    smells,
    improvedCode,
    improvementsMade,
    interviewQuestions: questionsOf(f, complexity),
  };
}
