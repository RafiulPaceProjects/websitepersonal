import { education, profile, publication, work } from "@/content/site";

// Compact route ledger below the hero: every nav anchor lands here,
// and scrolling finally has somewhere to go.
export function Ledger() {
  return (
    <section className="ledger" aria-label="Where the miles went">
      <h2 className="ledger-title">Where the miles went</h2>
      <div className="ledger-row" id="work">
        <p>
          <strong>Three levels, one story.</strong>{" "}
          {work.map((job) => `${job.org} (${job.period})`).join(" · ")}.{" "}
          <a className="row-link" href={work[0].link}>
            Read the diaspora stories
          </a>
        </p>
      </div>
      <div className="ledger-row" id="background">
        <p>
          <strong>Studied the signal.</strong> {education[0].degree},{" "}
          {education[0].school} ({education[0].period}). Published indoor
          positioning research.{" "}
          <a className="row-link" href={publication.doi}>
            Read the paper
          </a>
        </p>
      </div>
      <div className="ledger-row">
        <p>
          <strong>Your mile could be next.</strong> {profile.tagline}
        </p>
      </div>
    </section>
  );
}
