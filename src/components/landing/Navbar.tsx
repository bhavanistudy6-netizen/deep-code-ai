import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { BrandLink, GitHubIcon } from "@/components/Brand";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Examples", href: "#examples" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border glass">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 md:flex md:justify-between">
        <BrandLink />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" asChild aria-label="GitHub repository">
            <a href="https://github.com">
              <GitHubIcon />
            </a>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/analyze">Try It Free</Link>
          </Button>
        </div>

        <Button
          variant="soft"
          size="icon"
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu />
        </Button>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-5 py-3 md:hidden">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <Button variant="hero" className="mt-3" asChild>
              <Link to="/analyze">Try It Free</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
