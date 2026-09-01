import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { site } from "@/content/site";

interface CaseChromeProps {
  projectName: string;
  client: string;
  years: string;
  /** 1-based position, e.g. { index: 1, total: 2 } */
  index: number;
  total: number;
}

/** Static corner furniture for a case study — no hero, no travel. */
export function CaseChrome({
  projectName,
  client,
  years,
  index,
  total,
}: CaseChromeProps) {
  const pos = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="chrome chrome--case">
      <p className="brand brand--case">
        <Link href="/">← {site.name}</Link>
      </p>

      <p className="chrome__fx chrome__fx--tr">
        {projectName}
        <br />
        Case study
      </p>

      <p className="chrome__fx chrome__fx--bl">
        {client}
        <br />
        {years}
      </p>

      <div className="chrome__fx chrome__fx--br flex flex-col items-end gap-1.5">
        <span className="chrome__meta">
          {pos(index)} / {pos(total)}
        </span>
        <ThemeToggle />
      </div>
    </div>
  );
}
