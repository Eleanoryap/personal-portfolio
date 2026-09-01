import type { Metadata } from "next";
import { PageChrome } from "@/components/PageChrome";
import { SectionLabel } from "@/components/SectionLabel";
import { SignalLink } from "@/components/SignalLink";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Not found — ${site.name}`,
};

export default function NotFound() {
  return (
    <>
      <PageChrome back={{ href: "/", label: site.name }} />

      <main className="doc grid min-h-[72svh] place-items-center pt-28 pb-24 text-center">
        <div>
          <SectionLabel>Signal lost</SectionLabel>
          <div className="rule mt-2" aria-hidden="true">
            - - - - - - ✕ - - - - - ===++
          </div>
          <h1 className="font-display text-6xl font-extrabold tracking-tight text-ink">
            404
          </h1>
          <p className="mt-4 text-ink-body">
            That page isn&rsquo;t on the map.
          </p>
          <p className="mt-6 font-mono text-sm">
            <SignalLink href="/">← Back to the start</SignalLink>
          </p>
        </div>
      </main>
    </>
  );
}
