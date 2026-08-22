import { LogoMark, GitHubIcon } from "@/components/Brand";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <LogoMark className="size-8" />
          <p className="min-w-0 text-sm text-muted-foreground">
            ExplainMyCode AI — Built for developers who want to write better code.
          </p>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a
            href="https://github.com"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <GitHubIcon />
            GitHub
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
