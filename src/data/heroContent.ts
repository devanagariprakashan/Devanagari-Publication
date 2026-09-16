export const HERO_BANNER_DEFAULT = "/devanagari-hero-section.webp";

export type BookCoverType =
  | "hindi"
  | "polity"
  | "essay"
  | "history"
  | "constitution"
  | "law"
  | "gk"
  | "economy"
  | "science"
  | "geography";

export interface BookData {
  id: number | string;
  title: string;
  subtitle?: string;
  subject: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  coverType: BookCoverType;
  bgColor: string;
  textColor?: string;
  accentColor?: string;
  features?: string[];
  edition?: string;
  author?: string;
  badge?: string;
  image?: string;
  description?: string;
  highlights?: string[];
  isbn?: string;
}

export const HERO_BOOKS: BookData[] = [
  {
    id: 1,
    title: "सामान्य हिंदी व्याकरण",
    subtitle: "व्याकरण, रचना एवं निबंध",
    subject: "Hindi Grammar",
    category: "MPPSC & SI Special",
    price: 349,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 1480,
    coverType: "hindi",
    bgColor: "from-[#8B151B] via-[#A81820] to-[#5C0A0E]",
    textColor: "#FFFFFF",
    accentColor: "#FDE047",
    edition: "2025-26 Edition",
    badge: "Bestseller",
  },
  {
    id: 2,
    title: "भारत का इतिहास एवं संस्कृति",
    subtitle: "प्राचीन, मध्यकालीन व आधुनिक भारत",
    subject: "Indian History",
    category: "Civil Services / UPSC",
    price: 549,
    originalPrice: 799,
    rating: 5.0,
    reviewsCount: 3120,
    coverType: "history",
    bgColor: "from-[#084C38] via-[#0E6248] to-[#04281E]",
    textColor: "#FFFFFF",
    accentColor: "#FCD34D",
    edition: "Bestseller 2025",
    badge: "Top Rated",
  },
  {
    id: 3,
    title: "भारतीय संविधान एवं राजव्यवस्था",
    subtitle: "अनुच्छेदवार व्याख्या एवं केस स्टडी",
    subject: "Constitution & Polity",
    category: "MPPSC Paper-2 / UPSC",
    price: 479,
    originalPrice: 650,
    rating: 4.9,
    reviewsCount: 2240,
    coverType: "polity",
    bgColor: "from-[#0F2B5C] via-[#1A3F82] to-[#081836]",
    textColor: "#FFFFFF",
    accentColor: "#93C5FD",
    edition: "Updated Amendments",
    badge: "Recommended",
  },
  {
    id: 4,
    title: "उच्च स्तरीय निबंध माला",
    subtitle: "समसामयिक, विधिक एवं दार्शनिक विषय",
    subject: "Essay Writing",
    category: "Mains Paper-6",
    price: 299,
    originalPrice: 420,
    rating: 4.8,
    reviewsCount: 940,
    coverType: "essay",
    bgColor: "from-[#78350F] via-[#9A3412] to-[#451A03]",
    textColor: "#FFFFFF",
    accentColor: "#FDE68A",
    edition: "Standard Reference",
    badge: "50+ Essays",
  },
  {
    id: 5,
    title: "मध्य प्रदेश सामान्य ज्ञान (MP GK)",
    subtitle: "मानचित्र एवं तथ्यात्मक संपूर्ण संकलन",
    subject: "MP GK Special",
    category: "MPPSC Prelims & Mains",
    price: 389,
    originalPrice: 550,
    rating: 4.9,
    reviewsCount: 2890,
    coverType: "gk",
    bgColor: "from-[#4C1D95] via-[#6B21A8] to-[#2E1065]",
    textColor: "#FFFFFF",
    accentColor: "#FDE047",
    edition: "2025-26 Edition",
    badge: "Topper's Pick",
  },
  {
    id: 6,
    title: "भारतीय न्याय संहिता (BNS 2024)",
    subtitle: "नवीन आपराधिक कानून एवं प्रक्रिया",
    subject: "Law & Judiciary",
    category: "Civil Judge & Judiciary",
    price: 449,
    originalPrice: 599,
    rating: 4.9,
    reviewsCount: 1650,
    coverType: "law",
    bgColor: "from-[#4A0E13] via-[#681820] to-[#2A0609]",
    textColor: "#FFFFFF",
    accentColor: "#FBBF24",
    edition: "With New Codes",
    badge: "New 2025",
  },
  {
    id: 7,
    title: "भारतीय अर्थव्यवस्था एवं विकास",
    subtitle: "बजट, आर्थिक सर्वेक्षण व नीतियां",
    subject: "Indian Economy",
    category: "GS Paper-3",
    price: 429,
    originalPrice: 599,
    rating: 4.8,
    reviewsCount: 1320,
    coverType: "economy",
    bgColor: "from-[#0E4E49] via-[#14726B] to-[#062B28]",
    textColor: "#FFFFFF",
    accentColor: "#5EEAD4",
    edition: "Economic Survey 2025",
    badge: "High Yield",
  },
  {
    id: 8,
    title: "विज्ञान, प्रौद्योगिकी एवं पर्यावरण",
    subtitle: "पारिस्थितिकी, आपदा प्रबंधन एवं तकनीकी",
    subject: "Science & Tech",
    category: "UPSC / State PCS",
    price: 399,
    originalPrice: 549,
    rating: 4.8,
    reviewsCount: 1150,
    coverType: "science",
    bgColor: "from-[#14532D] via-[#18753E] to-[#082C15]",
    textColor: "#FFFFFF",
    accentColor: "#86EFAC",
    edition: "Latest Syllabus",
    badge: "Updated",
  },
  {
    id: 9,
    title: "भूगोल - भारत एवं विश्व",
    subtitle: "भौतिक, सामाजिक एवं आर्थिक भूगोल",
    subject: "Geography",
    category: "General Studies",
    price: 459,
    originalPrice: 620,
    rating: 4.9,
    reviewsCount: 1980,
    coverType: "geography",
    bgColor: "from-[#1E3A8A] via-[#2563EB] to-[#0F1D45]",
    textColor: "#FFFFFF",
    accentColor: "#93C5FD",
    edition: "Atlas & Maps",
    badge: "Maps Included",
  },
];

