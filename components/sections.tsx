import {
  work,
  education,
  publication,
  skillGroups,
  leadership,
  profile,
} from "@/content/site";
import { Reveal } from "@/components/reveal";

function Head({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div className="section-head">
      {kicker ? <p className="section-kicker">{kicker}</p> : null}
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

function ArenaMotif({ arena, numeral }: { arena: string; numeral: string }) {
  if (arena === "tinds") {
    return (
      <div className="arena-motif level-numeral" aria-hidden="true">
        <span>{numeral}</span>
      </div>
    );
  }
  if (arena === "ez") {
    return (
      <svg
        className="arena-motif"
        viewBox="0 0 120 90"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M12 48 60 14l48 34v32a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <circle cx="60" cy="58" r="9" fill="currentColor" />
        <circle cx="34" cy="30" r="3" fill="currentColor" />
        <circle cx="86" cy="30" r="3" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg
      className="arena-motif"
      viewBox="0 0 120 110"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M60 6 104 24v30c0 26-19 42-44 50C35 96 16 80 16 54V24Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="m42 54 13 13 24-27"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Work() {
  return (
    <section className="section" id="work" aria-label="Selected work">
      <Reveal>
        <Head title="Selected work" kicker="Three levels, one story" />
      </Reveal>
      <div className="stage-deck">
        {work.map((job) => (
          <article
            key={job.org}
            className={`stage-screen arena-${job.arena}`}
            aria-label={`${job.level}: ${job.org}`}
          >
            <div className="stage-screen-inner">
              <div className="stage-copy">
                <p className="stage-level">{job.level}</p>
                <h3 className="stage-org">
                  {job.link ? (
                    <a className="row-link" href={job.link}>
                      {job.org}
                    </a>
                  ) : (
                    job.org
                  )}
                </h3>
                <p className="stage-meta">
                  {job.role} · {job.period} · {job.place}
                </p>
                <p className="stage-outcome">{job.outcome}</p>
                <p className="stage-proof">{job.proof}</p>
                {job.link ? (
                  <p className="stage-visit">
                    <a className="row-link" href={job.link}>
                      Visit site ↗
                    </a>
                  </p>
                ) : null}
              </div>
              <ArenaMotif
                arena={job.arena}
                numeral={job.level.replace("LEVEL ", "")}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Background() {
  return (
    <section className="section" id="background" aria-label="Background">
      <Reveal>
        <Head title="Background" />
        <div className="prose-narrow">
          {education.map((entry) => (
            <p key={entry.school}>
              <strong>{entry.degree}</strong> — {entry.school}, {entry.place},{" "}
              {entry.period}
              {entry.note ? ` ${entry.note}` : ""}
            </p>
          ))}
          <p>
            <strong>Publication.</strong> {publication.title}.{" "}
            {publication.authors}. <em>{publication.journal}</em>.{" "}
            <a className="row-link" href={publication.doi}>
              DOI
            </a>{" "}
            — {publication.note}
          </p>
          <p>
            <strong>
              {leadership.role}, {leadership.org}.
            </strong>{" "}
            {leadership.period}. {leadership.note}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export function Toolbox() {
  return (
    <section className="section" id="toolbox" aria-label="Toolbox">
      <Reveal>
        <Head title="Toolbox" />
        <table className="spec-sheet">
          <tbody>
            {skillGroups.map((group) => (
              <tr key={group.label}>
                <th scope="row">{group.label}</th>
                <td className="what">{group.items}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}

export function Contact() {
  return (
    <section className="section" id="contact" aria-label="Contact">
      <Reveal>
        <Head title="Write to me" />
        <p className="cta-line">
          <a href={`mailto:${profile.email}`}>Start with an email.</a>
        </p>
        <div className="prose-narrow" style={{ marginTop: "var(--space-lg)" }}>
          <p>
            {profile.email} ·{" "}
            <a className="row-link" href={profile.linkedin}>
              LinkedIn
            </a>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
