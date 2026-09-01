import { PageChrome } from "./PageChrome";
import { site } from "@/content/site";

interface CaseChromeProps {
  projectName: string;
  client: string;
  years: string;
  /** 1-based position in the work list. */
  index: number;
  total: number;
}

const pos = (n: number) => String(n).padStart(2, "0");

/** Corner furniture for a case study — back to the work index. */
export function CaseChrome({
  projectName,
  client,
  years,
  index,
  total,
}: CaseChromeProps) {
  return (
    <PageChrome
      back={{ href: "/work", label: site.name }}
      topRight={
        <>
          {projectName}
          <br />
          Case study
        </>
      }
      bottomLeft={
        <>
          {client}
          <br />
          {years}
        </>
      }
      meta={
        <>
          {pos(index)} / {pos(total)}
        </>
      }
    />
  );
}
