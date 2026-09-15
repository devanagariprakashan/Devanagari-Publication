export interface BlogPost {
  image?: string;
  id: string;
  title: string;
  excerpt: string;
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
