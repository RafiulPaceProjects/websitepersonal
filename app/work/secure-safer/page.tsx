import type { Metadata } from "next";
import { WorkCase } from "@/components/work-case";
import { work } from "@/content/site";

const job = work.find((entry) => entry.slug === "secure-safer") ?? work[2];

export const metadata: Metadata = {
  title: `${job.org} — Rafiul Haider`,
  description: job.outcome,
};

export default function SecureSaferPage() {
  return <WorkCase job={job} />;
}
