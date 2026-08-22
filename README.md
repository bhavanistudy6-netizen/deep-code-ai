# Code Companion

Build a modern, premium, dark-mode SaaS web application called "ExplainMyCode AI".

The application is an AI-powered interactive code review and learning platform.

MAIN PURPOSE:

Users can paste source code, choose a programming language, select their experience level, and receive an intelligent code analysis.

The application should feel like a real developer tool used by software engineers, similar in quality to Linear, Vercel, GitHub, Raycast, or modern AI developer platforms.

Do NOT make this look like a student project.

==================================================

BRANDING

==================================================

App name: ExplainMyCode AI

Tagline:

"Understand your code. Find problems. Write better software."

Use a premium dark developer-tool aesthetic.

Design style:

- Dark background

- Deep charcoal and near-black surfaces

- Subtle purple and blue accent gradients

- Glassmorphism used minimally

- Soft borders

- Rounded corners

- Clean typography

- Modern monospace font for code

- Smooth animations

- Professional SaaS dashboard design

- Excellent spacing and visual hierarchy

Use a responsive layout for desktop, tablet, and mobile.

==================================================

LANDING PAGE

==================================================

Create a beautiful landing page.

NAVBAR:

Left side:

Logo icon + "ExplainMyCode AI"

Center/right navigation:

- Features

- How It Works

- Examples

Right side:

- GitHub icon button

- "Try It Free" primary button

HERO SECTION:

Large heading:

"Understand Code Like Never Before."

Highlight the words "Like Never Before" with a subtle purple-to-blue gradient.

Subtitle:

"Paste your code and get instant explanations, complexity analysis, bug detection, code smells, and AI-powered improvements."

Add two buttons:

Primary:

"Analyze Your Code"

Secondary:

"View Example"

Below the hero, create a beautiful mock code editor preview.

Left side:

A code editor showing a short JavaScript or Python function.

Right side:

An AI analysis card showing:

Code Quality

92/100

✓ Clean structure

✓ Efficient algorithm

⚠ Consider better error handling

Add subtle floating UI elements and gradients in the background, but keep the design professional and not overly flashy.

==================================================

FEATURES SECTION

==================================================

Create six feature cards with icons.

1. Line-by-Line Explanation

"Understand exactly what every part of your code does."

2. Complexity Analysis

"Automatically analyze time and space complexity."

3. Bug Detection

"Identify possible errors and risky code patterns."

4. Code Smells

"Discover maintainability and readability problems."

5. Better Code

"Get an improved version of your code."

6. Explain Your Way

"Choose how you want the explanation delivered."

Each card should have:

- Modern icon

- Title

- Short description

- Hover animation

- Subtle gradient border or glow on hover

==================================================

HOW IT WORKS SECTION

==================================================

Create a horizontal 3-step process.

Step 1:

Paste Your Code

Step 2:

Choose Your Level

Options:

👶 Beginner

🎓 Student

💻 Senior Developer

🎤 Interviewer

Step 3:

Get Your Analysis

Show a short animated connection between the steps.

==================================================

MAIN APPLICATION

==================================================

When the user clicks "Analyze Your Code" or "Try It Free", navigate to the main code analyzer interface.

Create a dashboard layout.

TOP NAVBAR:

Left:

Logo + ExplainMyCode AI

Center:

"Code Analyzer"

Right:

Theme icon

GitHub icon

User avatar placeholder

==================================================

CODE INPUT AREA

==================================================

Create a two-column layout.

LEFT COLUMN:

A large premium code editor interface.

Top of editor:

Language selector dropdown with:

- JavaScript

- Python

- Java

- C++

- C

- TypeScript

- HTML

- CSS

Next to it add:

"Clear Code" button

Inside the editor:

- Dark Monaco-editor-inspired design

- Line numbers

- Syntax highlighted sample code

- Monospace font

- Large paste area

Default sample code:

function findDuplicate(numbers) {

    for (let i = 0; i < numbers.length; i++) {

        for (let j = i + 1; j < numbers.length; j++) {

            if (numbers[i] === numbers[j]) {

                return numbers[i];

            }

        }

    }

    return null;

}

Below the editor add an experience level selector.

Title:

"Explain this code as..."

Create four selectable cards:

👶 Beginner

"Simple explanations with real-world examples"

🎓 Student

"Concept-focused explanations for learning"

💻 Senior Developer

"Focus on architecture, patterns and optimization"

🎤 Interviewer

"Focus on interview questions, edge cases and complexity"

Only one option can be selected at a time.

Highlight the selected option with a purple/blue accent.

At the bottom create a large primary button:

✨ Analyze My Code

==================================================

RIGHT COLUMN - ANALYSIS PANEL

==================================================

Before analysis, show an empty state.

Icon of code/AI.

Text:

"Ready to analyze your code"

Subtitle:

"Paste your code and click Analyze My Code."

After clicking Analyze My Code, display a realistic loading animation.

Loading messages should change:

"Reading your code..."

"Understanding the logic..."

"Checking complexity..."

"Looking for potential issues..."

"Generating improvements..."

Then reveal the complete analysis dashboard.

==================================================

ANALYSIS RESULTS

==================================================

Create tabs:

1. Overview

2. Explanation

3. Complexity

4. Bugs

5. Code Smells

6. Improved Code

7. Interview Mode

--------------------------------------------------

OVERVIEW TAB

--------------------------------------------------

Show a large circular score:

Code Quality Score

78/100

Create summary cards:

Readability

8.5/10

Efficiency

6/10

Maintainability

7/10

Security

9/10

Below that:

Strengths

✓ Easy to understand

✓ Correct duplicate detection

✓ Handles empty results

Improvements

⚠ Nested loops reduce performance

⚠ Could use a HashSet for O(n) performance

--------------------------------------------------

EXPLANATION TAB

--------------------------------------------------

Show the code broken into sections.

Example:

Line 1

function findDuplicate(numbers)

Explanation:

"This creates a function called findDuplicate that receives an array called numbers."

Include a "Why does this matter?" expandable section.

The explanation should change based on the selected user level.

For Beginner:

Use extremely simple language and analogies.

For Student:

Explain programming concepts and terminology.

For Senior Developer:

Discuss implementation decisions, tradeoffs and design considerations.

For Interviewer:

Focus on what an interviewer would expect the candidate to explain.

--------------------------------------------------

COMPLEXITY TAB

--------------------------------------------------

Create beautiful visualization cards.

Time Complexity:

O(n²)

Explanation:

"The nested loops compare each element against every other element."

Show a visual complexity indicator.

Space Complexity:

O(1)

Explanation:

"The algorithm uses only a few additional variables."

Add:

Optimization Opportunity

"Using a HashSet could reduce the time complexity from O(n²) to O(n)."

--------------------------------------------------

BUGS TAB

--------------------------------------------------

Show potential issues with severity badges.

Example:

MEDIUM

Performance Issue

Nested loops may cause slow performance for large arrays.

LOW

Input Validation

The function assumes that numbers is a valid array.

Each issue should have:

- Severity badge

- Title

- Description

- Suggested fix

--------------------------------------------------

CODE SMELLS TAB

--------------------------------------------------

Show detected code quality issues.

Examples:

Code Smell:

Nested Iteration

Impact:

Performance

Suggestion:

Consider using a HashSet.

Another:

Code Smell:

Generic Variable Naming

Impact:

Readability

Suggestion:

Use descriptive names where appropriate.

--------------------------------------------------

IMPROVED CODE TAB

--------------------------------------------------

Display an improved version of the code in a beautiful code editor.

Example:

function findDuplicate(numbers) {

    const seen = new Set();

    for (const number of numbers) {

        if (seen.has(number)) {

            return number;

        }

        seen.add(number);

    }

    return null;

}

Add buttons:

Copy Code

Compare Versions

Below the code show:

Improvements Made:

✓ Time complexity improved from O(n²) to O(n)

✓ More scalable for large datasets

✓ Cleaner iteration logic

Create a side-by-side comparison modal when the user clicks "Compare Versions".

--------------------------------------------------

INTERVIEW MODE TAB

--------------------------------------------------

Show:

"Interview Questions Based on Your Code"

Generate cards:

Question 1:

"What is the time complexity of your current solution?"

Question 2:

"How would your solution behave with one million elements?"

Question 3:

"Can you optimize this algorithm?"

Question 4:

"What edge cases would you test?"

Each question card should be expandable.

When expanded show:

Expected Answer

and

What a Strong Candidate Should Mention

==================================================

EXTRA INTERACTIONS

==================================================

Add:

- Copy buttons for code

- Smooth tab transitions

- Loading skeletons

- Animated progress indicators

- Hover states

- Toast notifications

- Keyboard shortcut hint:

Ctrl + Enter = Analyze

Make the "Analyze My Code" button functional.

For the first version, use realistic mock AI analysis data based on the sample code and dynamically update the UI state after the user clicks Analyze.

Structure the code cleanly with reusable React components.

==================================================

RESPONSIVE DESIGN

==================================================

Desktop:

Two-column code editor + analysis layout.

Tablet:

Stack sections intelligently.

Mobile:

Single-column layout with collapsible analysis sections.

Ensure the interface looks excellent on mobile.

==================================================

FOOTER

==================================================

Text:

"ExplainMyCode AI — Built for developers who want to write better code."

Links:

GitHub

Privacy

Terms

==================================================

FINAL REQUIREMENTS

==================================================

Make the entire application functional and interactive.

Do not use excessive text.

Prioritize:

- Premium UI

- Strong visual hierarchy

- Smooth animations

- Realistic developer-tool experience

- Clean component architecture

- Responsive design

The finished product should look like a startup SaaS product that could realistically be used by developers and engineering teams.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/af325f02-305d-44d7-95db-5db260db7676).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
