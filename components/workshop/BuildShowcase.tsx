import { Icon } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/lib/motion";

/** Chunky mockup of what students ship: a code pane feeding a running app. */
export function BuildShowcase() {
  return (
    <Reveal>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b-2 border-ink bg-cream px-4 py-3">
            <Icon name="code" className="size-4 text-ink" strokeWidth={2.25} />
            <span className="font-mono text-xs font-medium text-ink-soft">
              app/api/ask.ts
            </span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[0.78rem] leading-relaxed text-ink-soft">
            <code>{`const res = await ai.generate({
  system: "You are a concise study assistant.",
  prompt: userQuestion,
  schema: Answer,
});

return Response.json(res.object);`}</code>
          </pre>
        </div>

        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b-2 border-ink bg-cream px-4 py-3">
            <span className="font-display text-sm font-bold text-ink">
              Study Assistant
            </span>
            <Pill tone="green">Running</Pill>
          </div>
          <div className="space-y-3 p-5">
            <div
              className="ml-auto max-w-[82%] border-2 border-ink bg-sky px-4 py-2.5 text-sm text-ink"
              style={{ borderRadius: "14px 14px 4px 14px" }}
            >
              Explain gradient descent in two sentences.
            </div>
            <div
              className="max-w-[88%] border-2 border-ink bg-surface px-4 py-2.5 text-sm text-ink-soft"
              style={{ borderRadius: "14px 14px 14px 4px" }}
            >
              Gradient descent nudges a model&rsquo;s parameters toward less
              error, one small step at a time. Repeat until the error stops
              improving.
            </div>
            <div className="flex items-center gap-2 pt-1 text-xs font-bold text-green-ink">
              <Icon name="check" className="size-3.5" strokeWidth={3} />
              Structured output validated
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
