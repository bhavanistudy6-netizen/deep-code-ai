export type Level = "beginner" | "student" | "senior" | "interviewer";

export const LEVELS: {
  id: Level;
  emoji: string;
  label: string;
  description: string;
}[] = [
  {
    id: "beginner",
    emoji: "👶",
    label: "Beginner",
    description: "Simple explanations with real-world examples",
  },
  {
    id: "student",
    emoji: "🎓",
    label: "Student",
    description: "Concept-focused explanations for learning",
  },
  {
    id: "senior",
    emoji: "💻",
    label: "Senior Developer",
    description: "Focus on architecture, patterns and optimization",
  },
  {
    id: "interviewer",
    emoji: "🎤",
    label: "Interviewer",
    description: "Focus on interview questions, edge cases and complexity",
  },
];

export const LANGUAGES = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C",
  "TypeScript",
  "HTML",
  "CSS",
];

export const SAMPLE_CODE = `function findDuplicate(numbers) {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
            if (numbers[i] === numbers[j]) {
                return numbers[i];
            }
        }
    }
    return null;
}`;

export const IMPROVED_CODE = `function findDuplicate(numbers) {
    const seen = new Set();
    for (const number of numbers) {
        if (seen.has(number)) {
            return number;
        }
        seen.add(number);
    }
    return null;
}`;

export const LOADING_MESSAGES = [
  "Reading your code...",
  "Understanding the logic...",
  "Checking complexity...",
  "Looking for potential issues...",
  "Generating improvements...",
];

export const SCORES = {
  overall: 78,
  metrics: [
    { label: "Readability", value: 8.5, max: 10 },
    { label: "Efficiency", value: 6, max: 10 },
    { label: "Maintainability", value: 7, max: 10 },
    { label: "Security", value: 9, max: 10 },
  ],
  strengths: [
    "Easy to understand",
    "Correct duplicate detection",
    "Handles empty results",
  ],
  improvements: [
    "Nested loops reduce performance",
    "Could use a HashSet for O(n) performance",
  ],
};

type Explanation = {
  line: string;
  code: string;
  text: Record<Level, string>;
  why: Record<Level, string>;
};

export const EXPLANATIONS: Explanation[] = [
  {
    line: "Line 1",
    code: "function findDuplicate(numbers)",
    text: {
      beginner:
        "This creates a function called findDuplicate that receives a list of numbers — like handing someone a shopping list to check.",
      student:
        "A function declaration that accepts one parameter, numbers, expected to be an array. The function name describes its single responsibility.",
      senior:
        "Declares a pure, side-effect-free utility with a single array parameter. No type contract is enforced, so callers own input validity.",
      interviewer:
        "The candidate should state the signature, the assumed input type, and the return contract (a value or null) before writing logic.",
    },
    why: {
      beginner:
        "Naming things clearly means you can read your code later and still know what it does.",
      student:
        "Clear function boundaries make code testable and reusable across a project.",
      senior:
        "Without a type guard or JSDoc, this becomes an implicit contract — a common source of runtime bugs at module boundaries.",
      interviewer:
        "Strong candidates clarify requirements first: one duplicate or all? First duplicate or any?",
    },
  },
  {
    line: "Lines 2–3",
    code: "for (let i = 0; ...) { for (let j = i + 1; ...) {",
    text: {
      beginner:
        "Two loops run one inside the other, so every number gets compared to every number after it.",
      student:
        "A classic nested-loop pairwise comparison. Starting j at i + 1 avoids comparing an element with itself and avoids duplicate pairs.",
      senior:
        "Brute-force pairwise scan, O(n²) time and O(1) space. Reasonable only for tiny inputs or when allocation must be avoided.",
      interviewer:
        "Expect the candidate to immediately identify the quadratic pair enumeration and the j = i + 1 optimisation.",
    },
    why: {
      beginner:
        "Doing work twice over adds up fast — with 1,000 numbers this is about half a million comparisons.",
      student:
        "Understanding nested loop bounds is how you learn to count operations and reason about Big-O.",
      senior:
        "Time/space tradeoff decision point: hashing buys linear time for linear memory.",
      interviewer:
        "This is where the interview usually pivots to 'can you do better?'",
    },
  },
  {
    line: "Lines 4–6",
    code: "if (numbers[i] === numbers[j]) return numbers[i];",
    text: {
      beginner:
        "If two numbers match, the function stops right away and gives back that number.",
      student:
        "Strict equality (===) compares value and type. Returning early exits both loops immediately.",
      senior:
        "Early return keeps the happy path shallow; strict equality avoids coercion surprises but also fails for object identity cases.",
      interviewer:
        "Ask why === over ==, and what happens with NaN or mixed types in the array.",
    },
    why: {
      beginner: "Stopping early means the computer does less work.",
      student: "Early returns reduce nesting and make functions easier to follow.",
      senior:
        "Early return is the cheapest readability win in imperative code — no accumulator state to reason about.",
      interviewer:
        "Edge-case awareness (NaN never equals NaN) separates good from great answers.",
    },
  },
  {
    line: "Line 9",
    code: "return null;",
    text: {
      beginner: "If nothing matched, the function returns null, meaning 'nothing found'.",
      student:
        "A sentinel return value signalling absence. Callers must check for null before using the result.",
      senior:
        "null-as-absence works, but undefined vs null vs Option-style results should be consistent across the codebase.",
      interviewer:
        "Expect discussion of return-type consistency and how callers distinguish 'no duplicate' from a falsy duplicate like 0.",
    },
    why: {
      beginner: "Always answering something means the caller is never confused.",
      student: "Explicit absence values prevent accidental undefined bugs.",
      senior:
        "If 0 can be a valid duplicate, a truthiness check at the call site is a latent bug.",
      interviewer:
        "The 0 vs null falsy trap is a great follow-up question here.",
    },
  },
];

export const COMPLEXITY = {
  time: {
    value: "O(n²)",
    explanation: "The nested loops compare each element against every other element.",
    level: 80,
    rating: "Quadratic",
  },
  space: {
    value: "O(1)",
    explanation: "The algorithm uses only a few additional variables.",
    level: 15,
    rating: "Constant",
  },
  optimization:
    "Using a HashSet could reduce the time complexity from O(n²) to O(n).",
  growth: [
    { n: "10", ops: "100", bar: 8 },
    { n: "100", ops: "10,000", bar: 26 },
    { n: "1,000", ops: "1,000,000", bar: 58 },
    { n: "10,000", ops: "100,000,000", bar: 100 },
  ],
};

export const BUGS = [
  {
    severity: "MEDIUM" as const,
    title: "Performance Issue",
    description: "Nested loops may cause slow performance for large arrays.",
    fix: "Track seen values in a Set and return on the first repeat for O(n) time.",
  },
  {
    severity: "LOW" as const,
    title: "Input Validation",
    description: "The function assumes that numbers is a valid array.",
    fix: "Guard with Array.isArray(numbers) and return null early for invalid input.",
  },
  {
    severity: "LOW" as const,
    title: "Falsy Return Ambiguity",
    description: "A duplicate of 0 is indistinguishable from null at truthy call sites.",
    fix: "Compare the result strictly against null, or return an { found, value } object.",
  },
];

export const SMELLS = [
  {
    name: "Nested Iteration",
    impact: "Performance",
    suggestion: "Consider using a HashSet.",
  },
  {
    name: "Generic Variable Naming",
    impact: "Readability",
    suggestion: "Use descriptive names where appropriate.",
  },
  {
    name: "Missing Guard Clause",
    impact: "Robustness",
    suggestion: "Validate the input shape before iterating.",
  },
];

export const IMPROVEMENTS = [
  "Time complexity improved from O(n²) to O(n)",
  "More scalable for large datasets",
  "Cleaner iteration logic",
];

export const INTERVIEW_QUESTIONS = [
  {
    question: "What is the time complexity of your current solution?",
    answer:
      "O(n²) time and O(1) space — the inner loop runs roughly n/2 times for each of the n outer iterations.",
    strong:
      "Mention that constants drop out of Big-O, and that space stays constant because no auxiliary structure is allocated.",
  },
  {
    question: "How would your solution behave with one million elements?",
    answer:
      "Around 5×10¹¹ comparisons in the worst case — effectively unusable, blocking the main thread for minutes.",
    strong:
      "Reason about real numbers, not just notation, and note that the duplicate's position drives best-case behaviour.",
  },
  {
    question: "Can you optimize this algorithm?",
    answer:
      "Yes — a Set of seen values gives O(n) time with O(n) space; sorting first gives O(n log n) time with O(1) extra space.",
    strong:
      "Offer more than one option and state the tradeoff explicitly instead of jumping straight to hashing.",
  },
  {
    question: "What edge cases would you test?",
    answer:
      "Empty array, single element, all identical, no duplicates, NaN values, mixed types, and a duplicate of 0.",
    strong:
      "Call out NaN !== NaN and the falsy-0 return ambiguity without being prompted.",
  },
];
