export interface TeamMember {
  image?: string;
  name: string;
  role: string;
  dept: string;
  experience: string;
  qualification: string;
  bio: string;
  gradient: string;
}

export const CORE_TEAM: TeamMember[] = [
  {
    name: "Mr. Mayank Jagdish Sharma",
    role: "Chief Academic Director & Author",
    dept: "Hindi Sahitya & Vyakaran",
    experience: "12+ Years Exp.",
    qualification: "M.A. Hindi Lit., UGC-NET",
    bio: "Renowned Hindi literature & grammar mentor. Guided 15,000+ selected candidates.",
    gradient: "from-red-600 to-amber-700",
  },
  {
    name: "Adv. Sunita Joshi",
    role: "Head of Legal Studies",
    dept: "Law & Judiciary",
    experience: "14+ Years Exp.",
    qualification: "LL.M., Ex-Public Prosecutor",
    bio: "Pioneering author in New Criminal Laws 2024 and Civil Judge Mains answer writing.",
    gradient: "from-blue-700 to-indigo-900",
  },
  {
    name: "Dr. Rajesh Verma",
    role: "Senior Research Fellow",
    dept: "General Studies & Ethics",
    experience: "16+ Years Exp.",
    qualification: "Ph.D., Former PSC Panelist",
    bio: "Specialist in MP GK, Indian Polity, and Ethics. Authored 8 benchmark textbooks.",
    gradient: "from-emerald-700 to-teal-900",
  },
  {
    name: "Prof. Arvind Tiwari",
    role: "Senior Faculty & Researcher",
    dept: "History & Heritage",
    experience: "10+ Years Exp.",
    qualification: "M.Phil History, Rankholder",
    bio: "Expert on MP's tribal dynasties, modern Indian freedom struggle, and heritage.",
    gradient: "from-purple-700 to-violet-950",
  },
  {
    name: "Dr. Kavita Sharma",
    role: "Chief Content Editor",
    dept: "Editorial & QC",
    experience: "9+ Years Exp.",
    qualification: "Ph.D. Linguistics",
    bio: "Ensures 100% factual accuracy, impeccable grammar, and syllabus synchronization.",
    gradient: "from-amber-600 to-rose-700",
  },
  {
    name: "Amitabh Chouhan",
    role: "Director of Digital Learning",
    dept: "Technology",
    experience: "8+ Years Exp.",
    qualification: "B.Tech, MBA",
    bio: "Drives rapid student feedback incorporation and digital resources for aspirants.",
    gradient: "from-slate-700 to-zinc-900",
  },
];


export const PAGE_SETTINGS = {
  "title": "Our Team",
  "subtitle": "Meet our expert faculty, authors, and researchers.",
  "badge1": "100% Syllabus Aligned",
  "badge2": "15+ Yrs Academic Pedigree",
  "badge3": "50k+ Students Guided",
  "ctaBadge": "Join As An Author",
  "ctaTitle": "Want to publish your book with Devanagari?",
  "ctaDescription": "If you are an educator or researcher, contact our editorial team to share your manuscript.",
  "ctaLabel": "Contact Editorial Board ?",
  "ctaHref": "/contact"
};
