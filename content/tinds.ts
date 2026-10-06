// TINDS case-page content. Facts are Rafiul's own; media slots stay empty
// until he supplies files/URLs — every section self-hides when its data is
// absent, so the page never shows an empty box or a broken embed.

export type TindsBanner = {
  src: string;
  alt: string;
};

export type TindsReel = {
  /** Full Instagram post/reel URL, e.g. https://www.instagram.com/reel/… */
  url: string;
  label: string;
};

export type TindsSlide = {
  src?: string;
  alt?: string;
  /** Instagram post URL — renders as an embed instead of an image. */
  url?: string;
  label?: string;
  caption?: string;
};

export type TindsArticle = {
  image: string;
  imageAlt: string;
  topic: string;
  title: string;
  dek: string;
  url: string;
};

export const tinds = {
  org: "TINDS",
  role: "Content Writer & B2B Relationship Manager",
  period: "2021 – 2023",
  place: "Remote",
  headline: "Where I learned to make stories sell.",
  subhead: "Where Stories Meet Impact",
  introduction:
    "I helped bring South Asian stories to life, from the words on the page to the visuals in Canva, and built relationships with the businesses behind them.",
  articleCredit: "Writing & visual design by Rafiul · Made in Canva",
  tracks: [
    {
      title: "Content",
      text: "Wrote diaspora stories, entrepreneur spotlights, and guides for a global South Asian audience — personality-driven pieces with vivid headlines.",
    },
    {
      title: "Relationships",
      text: "Sold and serviced the promotion packages that fund the journalism: press releases, feature stories, and website ad banners for South Asian businesses.",
    },
  ],
  // Article-banner backgrounds. Drop files in public/work/ and list them here;
  // the hero crossfades through them. Empty = dark shell only.
  banners: [] as TindsBanner[],
  reels: [
    {
      url: "https://www.instagram.com/reel/DUY-0qmjra0/",
      label: "Rafiul in a TINDS reel — @tindsofficial",
    },
    {
      url: "https://www.instagram.com/reel/DNEdC4NTXft/",
      label: "Rafiul in a TINDS reel — @tindsofficial",
    },
    {
      url: "https://www.instagram.com/reel/DcG-EOWCRL-/",
      label: "TINDS reel on Instagram — @tindsofficial",
    },
    {
      url: "https://www.instagram.com/reel/DSAkCcmkixW/",
      label: "TINDS reel on Instagram — @tindsofficial",
    },
    {
      url: "https://www.instagram.com/reel/DdMBLnnihgi/",
      label: "TINDS reel on Instagram — @tindsofficial",
    },
    {
      url: "https://www.instagram.com/p/Db3v8IwjhYk/",
      label: "TINDS post on Instagram — @tindsofficial",
    },
    {
      url: "https://www.instagram.com/reel/DaafNkfASEm/",
      label: "TINDS reel on Instagram — @tindsofficial",
    },
  ] as TindsReel[],
  feature: {
    url: "https://www.instagram.com/p/DU6Y3PLk82U/",
    label: "Featured TINDS post — @tindsofficial",
    caption: "Featured work from @tindsofficial.",
  } as null | {
    src?: string;
    alt?: string;
    url?: string;
    label?: string;
    caption: string;
  },
  slides: [
    {
      url: "https://www.instagram.com/p/DZdx08WFRVj/",
      label: "TINDS post on Instagram — @tindsofficial",
    },
    {
      url: "https://www.instagram.com/p/DZcshjUlHfN/",
      label: "TINDS post on Instagram — @tindsofficial",
    },
    {
      url: "https://www.instagram.com/p/DYAKwVFlKTd/",
      label: "TINDS post on Instagram — @tindsofficial",
    },
  ] as TindsSlide[],
  articles: [
    {
      image: "ali-mehedi",
      imageAlt:
        "TINDS feature graphic for Ali Mehedi and the NYC South Asian Comedy Festival",
      topic: "Culture & community",
      title:
        "Ali Mehedi Unleashes 40+ South Asian Comedians at NYC's Epic Comedy Festival",
      dek: "A New York stage for South Asian comedy, bringing more than 40 comedians together across five shows.",
      url: "https://tinds.com/ali-mehedi-unleashes-40-south-asian-comedians/",
    },
    {
      image: "shehab-shahariar",
      imageAlt:
        "TINDS spotlight graphic featuring Bangla music artist Shehab Shahariar",
      topic: "Music & identity",
      title:
        "Shehab Shahariar: The Independent Artist Building Bangla Music for the World",
      dek: "Meet Shibu, the independent artist finding a global audience for a sound rooted in Dhaka.",
      url: "https://tinds.com/shehab-shahariar-engineering-a-spectacular/",
    },
    {
      image: "kumkum-kalam",
      imageAlt: "TINDS spotlight graphic featuring food creator Kumkum Kalam",
      topic: "Food & diaspora",
      title: "Kumkum Kalam: Plating Bangladesh for the World",
      dek: "A chef and creator sharing Bangladeshi food, memory and culture with the world.",
      url: "https://tinds.com/kumkum-kalam-plating-bangladesh-for-the-world/",
    },
    {
      image: "darsheel-safary",
      imageAlt: "TINDS spotlight graphic featuring actor Darsheel Safary",
      topic: "Film & storytelling",
      title:
        "Darsheel Safary: The Unforgettable Journey of India's Award-Winning Actor",
      dek: "The actor behind Ishaan in Taare Zameen Par, and the creative life that followed his breakout role.",
      url: "https://tinds.com/darsheel-safary-the-tale-of-a-child-prodigy/",
    },
  ] as TindsArticle[],
};
