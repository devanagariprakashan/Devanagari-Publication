export interface BlogPost {
  image?: string;
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  author: string;
  authorRole: string;
  readTime: string;
  date: string;
  imageBg: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "mppsc-prelims-2025-strategy",
    title: "MPPSC 2025: New Syllabus & 90-Day Prelims Strategy",
    excerpt:
      "Best study material and important chapters for General Studies and MP Special as per the latest MPPSC exam pattern.",
    content:
      "MPPSC Prelims rewards consistent revision far more than last-minute cramming. With roughly 90 days on the clock, split your preparation into three clear phases: the first month for building a strong foundation across General Studies and MP Special topics, the second month for solving previous years' papers topic-wise, and the final month purely for revision and full-length mock tests.\n\nMP Special deserves focused attention — history, geography, economy, and current government schemes of Madhya Pradesh carry a disproportionate share of marks compared to their syllabus length, so prioritise them early.\n\nKeep a single revision notebook for facts, numbers, and static portions you tend to forget, and revisit it every few days instead of re-reading full books. Attempt at least one full-length mock test every week from the halfway point onward, and spend more time reviewing your mistakes than taking the test itself — that review is where the actual score improvement happens.",
    category: "MPPSC",
    author: "Mr. Mayank Sharma",
    authorRole: "Senior Faculty & Author",
    readTime: "6 min read",
    date: "Feb 28, 2025",
    imageBg: "from-red-600 to-amber-700",
  },
  {
    id: "bns-criminal-laws-guide",
    title: "New Criminal Laws 2024: What changed for Judiciary & Civil Judge?",
    excerpt:
      "Key sections of new laws replacing IPC, CrPC, and Evidence Act, and mains answer writing approach.",
    content:
      "The three new criminal codes replace decades-old legislation, and examiners are actively testing whether candidates can map old provisions to their new equivalents — not just recite section numbers in isolation.\n\nWhen you study, build a comparison table for yourself: old section, new section, and what substantively changed (if anything). Many provisions were simply renumbered, but a meaningful subset saw real changes in procedure, timelines, or punishment — those are the ones examiners favour.\n\nFor Mains answer writing, always cite the new section but mention the old one in brackets on first use, since evaluators are used to both. Judgment and application-based questions expect you to apply the new procedural timelines correctly, so practise writing out full procedural sequences (FIR to trial) under the new framework, not just definitions.",
    category: "Judiciary",
    author: "Adv. Sunita Joshi",
    authorRole: "Judicial Services Mentor",
    readTime: "8 min read",
    date: "Feb 25, 2025",
    imageBg: "from-blue-700 to-indigo-900",
  },
  {
    id: "hindi-vyakaran-mppsc-paper-5",
    title: "MPPSC Mains Paper-5: How to score 150+ in General Hindi & Grammar",
    excerpt:
      "Practical techniques to get full marks in Sandhi, Samas, Idioms, Technical Vocabulary, and Pallavan.",
    content:
      "General Hindi & Grammar is one of the few Mains papers where scores can be pushed close to full marks with disciplined practice, because the question types repeat every year — Sandhi, Samas, Muhavare (idioms), Paryayvachi-Vilom, technical/official terminology, and Pallavan (essay expansion of a thought).\n\nBuild a running list of frequently confused Sandhi and Samas examples rather than trying to memorise rules in isolation — recognition speed matters more than rule recitation in the exam hall. For technical vocabulary, practise translating common administrative English terms into their standard Hindi equivalents, since this section rewards precision over creativity.\n\nPallavan is the one open-ended part of the paper: practise expanding a proverb or thought into a well-structured 150–200 word paragraph with a clear opening, elaboration, and closing line, and time yourself so this section doesn't eat into time meant for the more mechanical grammar questions.",
    category: "Hindi Sahitya",
    author: "Dr. Rajesh Verma",
    authorRole: "Hindi Sahitya Expert",
    readTime: "5 min read",
    date: "Feb 20, 2025",
    imageBg: "from-emerald-700 to-teal-900",
  },
  {
    id: "civil-judge-answer-writing",
    title: "MP Civil Judge Mains 2025: Judgment Writing & Case Law Reference Guide",
    excerpt:
      "Formatting, framing issues, and using relevant Supreme Court precedents in civil and criminal judgment writing.",
    content:
      "Judgment writing is graded as much on structure as on legal correctness. Every judgment you write should follow the same skeleton: brief facts, points/issues for determination, discussion of evidence and law issue-by-issue, and a clearly stated final order — examiners lose patience with answers that mix these stages together.\n\nFraming issues correctly is the single highest-leverage skill in this paper. Read the fact pattern twice before writing anything, list out every disputed question of fact and law separately, and make sure your issues actually cover everything the parties are disputing — a missed issue usually costs more marks than a weak discussion of an issue you did include.\n\nWhen citing precedent, prefer a small number of well-known, directly relevant Supreme Court judgments over a long list of loosely related citations — examiners can tell when a citation is dropped in just to pad the answer rather than to actually support the reasoning.",
    category: "Judiciary",
    author: "Adv. Sunita Joshi",
    authorRole: "Judicial Services Mentor",
    readTime: "7 min read",
    date: "Feb 15, 2025",
    imageBg: "from-purple-700 to-violet-950",
  },
  {
    id: "notes-making-revision-strategy",
    title: "Short Notes & 3-Stage Revision Formula for Competitive Exams",
    excerpt:
      "Effective mind map and flowchart methods to revise 1000+ pages of vast syllabus in 24 hours.",
    content:
      "The point of short notes is not to summarise everything you read — it's to capture only what you personally forget. If you re-read your notes and everything on the page still feels obvious, you're writing too much; trim it down to triggers and keywords that unlock the full concept in your memory.\n\nThe 3-stage revision formula works like this: Stage 1 (within a week of first reading a topic) — convert your notes into a one-page mind map or flowchart connecting related ideas visually. Stage 2 (two to three weeks later) — revise only the mind maps, not the original material, and mark anything you hesitate on. Stage 3 (final week before the exam) — revise only the marked, hesitant portions across all subjects.\n\nDone this way, a syllabus that originally took weeks to read the first time can genuinely be revised in a single focused day, because you're no longer re-reading full content — you're refreshing memory triggers you've already built.",
    category: "Exam Strategy",
    author: "Devanagari Editorial Team",
    authorRole: "Academic Research Wing",
    readTime: "4 min read",
    date: "Feb 10, 2025",
    imageBg: "from-amber-600 to-orange-800",
  },
  {
    id: "mp-gk-history-culture",
    title: "MP History & Culture: Important Dynasties & Tribal Heritage",
    excerpt:
      "Quiz and analytical articles based on the historical landscape of Gond, Bhil, and Bundelkhand-Baghelkhand.",
    content:
      "MP History & Culture questions in MPPSC frequently link a dynasty or region to a monument, art form, or present-day district — so studying dynasties in isolation from geography is a common mistake. Build your notes region-wise (Bundelkhand, Baghelkhand, Malwa, Nimar, Mahakoshal) rather than purely chronologically, and attach the relevant tribal communities, forts, and cultural practices to each region as you go.\n\nTribal heritage — particularly the Gond and Bhil communities — is a recurring theme across both Prelims and Mains, covering their historical role, art forms, festivals, and current government welfare schemes. Treat this as one connected topic rather than scattered facts, since Mains questions often ask you to analyse rather than just list.\n\nRegular quiz practice on this topic works better than plain reading, because most of these facts are the kind you either recall instantly or not at all — spaced repetition through quizzes builds that instant recall far more reliably than re-reading notes.",
    category: "MPPSC",
    author: "Prof. Arvind Tiwari",
    authorRole: "History Faculty",
    readTime: "6 min read",
    date: "Jan 30, 2025",
    imageBg: "from-rose-600 to-red-900",
  },
];



export const PAGE_SETTINGS = {
  "title": "Blogs",
  "subtitle": "Expert strategies, legal updates, and exam guidance.",
  "ctaBadge": "Free Exam Digest",
  "ctaTitle": "Get Latest Exam Notes & Blogs",
  "ctaDescription": "Join 20,000+ students benefiting from Devanagari study guides weekly.",
  "ctaLabel": "Explore Catalog ?",
  "ctaHref": "/shop",
  "searchPlaceholder": "Search articles...",
  "emptyTitle": "No articles found",
  "emptyDescription": "Try searching with different keywords."
};
