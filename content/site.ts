export const profile = {
  name: "Rafiul Haider",
  photo: "/profile-hero.jpg",
  photoAlt: "Portrait of Rafiul Haider holding a coffee cup in an office",
  role: "Data Science · Research · Content",
  location: "Woodside, Queens, NY",
  email: "rafiul.haider@pace.edu",
  linkedin: "https://www.linkedin.com/in/rafiul-haider",
  instagram: "https://www.instagram.com/rafiulhaider_/",
  github: "https://github.com/RafiulPaceProjects",
  tagline: "Analysis you can act on.",
  intro:
    "I turn messy inputs (data, research, half-formed ideas) into things people can use: clean analysis, clear writing, working systems.",
};

export type WorkEntry = {
  org: string;
  role: string;
  period: string;
  place: string;
  outcome: string;
  link?: string;
  level: string;
  arena: "tinds" | "ez" | "secure";
  proof: string;
};

export const work: WorkEntry[] = [
  {
    org: "TINDS",
    role: "Content Writer, Sales",
    period: "2021 – 2023",
    place: "Remote",
    outcome:
      "Wrote stories for a South Asian media platform and helped sell the platform that carries them.",
    link: "https://www.tinds.com",
    level: "LEVEL 01",
    arena: "tinds",
    proof: "Diaspora storytelling and brand promotion packages.",
  },
  {
    org: "EZ Living Home Care",
    role: "WordPress Website Maintenance",
    period: "2022 – 2023",
    place: "Remote",
    outcome:
      "Kept the agency's website accurate and online: content, uptime, and announcements.",
    level: "LEVEL 02",
    arena: "ez",
    proof: "Website upkeep for a New York home-care agency.",
  },
  {
    org: "Secure Safer Insurance & Advocacy",
    role: "CSR and IT Support",
    period: "July 2024 – now",
    place: "Remote → Queens, NY",
    outcome:
      "HighLevel specialist: workflows, automation, and client retention.",
    level: "LEVEL 03",
    arena: "secure",
    proof: "Client retention at a 5.0-star-rated Queens insurance agency.",
  },
];

export const education = [
  {
    school: "Pace University",
    degree: "MSc, Data Science",
    period: "Expected 2027",
    place: "Queens, New York",
    note: "Pace Merit-Based Scholarship, 2025.",
  },
  {
    school:
      "Bangladesh Army International University of Science and Technology",
    degree: "BSc, Electrical & Electronics Engineering",
    period: "2023 · GPA 3.28",
    place: "Cumilla, Bangladesh",
    note: "UGC-listed, Bangladesh Army-administered private university (est. 2015).",
  },
];

export const publication = {
  title:
    "Trilateration-based indoor localization utilizing the matrix completion method by probabilistic matrix factorization and stochastic gradient",
  journal: "International Journal of Information Technology",
  authors:
    "Md. Nahidul Alam, Rafiul Haider, Imam Hossain Pipul, Fahim ul Haque",
  doi: "https://doi.org/10.1007/s41870-024-01857-3",
  note: "Final thesis project, published April 2024, Vol 17, pp. 5577-5590 (Springer Nature, Scopus Q2): RSSI-based positioning that fills gaps from missing or noisy data, more reliable than KNN in obstructed rooms.",
};

export const skillGroups = [
  {
    label: "Research & data",
    items: "Excel (cleaning, formulas) · analytics dashboards · Python (basic)",
  },
  {
    label: "Web & content",
    items: "WordPress CMS · JavaScript (basic) · C (basic) · SEO writing",
  },
  {
    label: "Working with people",
    items:
      "Client support · ticketing systems · GoHighLevel (workflows, automation) · EZLynx · LAN/WAN setup · troubleshooting",
  },
  {
    label: "Languages",
    items: "English (fluent) · Bengali (fluent)",
  },
];

export const leadership = {
  org: "BAIUST Global Affairs Council",
  role: "Secretary of Foreign Affairs",
  period: "2022 – 2024",
  note: "Ran logistics and hospitality for foreign delegations at Model UN programs in Bangladesh.",
};
