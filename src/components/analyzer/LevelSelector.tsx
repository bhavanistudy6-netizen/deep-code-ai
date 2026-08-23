import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEVELS, type Level } from "@/lib/analysis-data";

export function LevelSelector({
  value,
  onChange,
}: {
  value: Level;
  onChange: (level: Level) => void;
}) {
  return (
    <section>
      <h2 className="text-sm font-semibold tracking-tight text-foreground">
        Explain this code as...
      </h2>
      <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
        {LEVELS.map((level) => {
          const active = level.id === value;
          return (
            <button
              key={level.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(level.id)}
              className={cn(
                "panel panel-hover relative cursor-pointer p-4 text-left",
                active
                  ? "border-primary/60 bg-primary/[0.08] shadow-[0_18px_44px_-26px_var(--brand)]"
                  : "",
              )}
            >
              {active && (
                <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-gradient-brand shadow-[0_6px_16px_-6px_var(--brand)]">
                  <Check className="size-3 text-primary-foreground" />
                </span>
              )}

              <p className="text-sm font-semibold">
                <span className="mr-2">{level.emoji}</span>
                {level.label}
              </p>
              <p className="mt-1.5 pr-6 text-xs leading-relaxed text-muted-foreground">
                {level.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
