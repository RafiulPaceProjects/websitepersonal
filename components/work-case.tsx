import type { WorkEntry } from "@/content/site";
import { asset } from "@/lib/env";

// Shared template for the three work case pages. Facts come straight from
// content/site.ts; nothing here invents outcomes or dates.
export function WorkCase({ job }: { job: WorkEntry }) {
  return (
    <div className="case">
      <main className="case-inner">
        <p className="case-back">
          <a href={asset("/")} aria-label="Back to the homepage">
            ← Rafiul Haider
          </a>
        </p>
        <p className="case-kicker">{job.level}</p>
        <h1 className="case-title">{job.org}</h1>
        <p className="case-meta">
          {job.role} · {job.period} · {job.place}
        </p>
        <p className="case-outcome">{job.outcome}</p>
        <p className="case-proof">{job.proof}</p>
        {job.link ? (
          <p className="case-visit">
            <a
              className="row-link"
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit site ↗
            </a>
          </p>
        ) : null}
      </main>
    </div>
  );
}
