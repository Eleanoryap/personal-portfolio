/**
 * Ruled key/value register used for project parameters. Mono throughout,
 * hairline rule under every row.
 */
export function MetaTable({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="border-t border-hairline">
      {rows.map(([term, value]) => (
        <div
          key={term}
          className="border-b border-hairline py-2.5 font-mono text-xs sm:grid sm:grid-cols-[8rem_1fr] sm:gap-x-4"
        >
          <dt className="uppercase tracking-[0.15em] text-ink-muted">{term}</dt>
          <dd className="mt-1 text-ink-body sm:mt-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
