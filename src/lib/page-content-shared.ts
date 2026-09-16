import { z } from "zod";
import { CORE_TEAM, PAGE_SETTINGS as TEAM_SETTINGS } from "@/data/teamContent";
import { BLOG_POSTS, PAGE_SETTINGS as BLOG_SETTINGS } from "@/data/blogContent";

import { HERO_BANNER_DEFAULT, HERO_BOOKS } from "@/data/heroContent";

export { HERO_BANNER_DEFAULT };

const text = z.string().max(10000);
const imageUrl = text.refine(value => value === "" || /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value), "Use a site path or HTTP(S) image URL");
const requiredImageUrl = text.min(1).refine(value => /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value), "Use a site path or HTTP(S) image URL");
const teamItem = z.object({ image: imageUrl.default(""), name: text.min(1), role: text, dept: text, experience: text, qualification: text, bio: text, gradient: text });
const blogItem = z.object({ image: imageUrl.default(""), id: text.min(1), title: text.min(1), excerpt: text, category: text.min(1), author: text, authorRole: text, readTime: text, date: text, imageBg: text });
const safeHref = text.refine(value => /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value), "Use a site path or an HTTP(S) URL");
const settingsSchema = (defaults: Record<string, string>) => z.object(Object.fromEntries(Object.keys(defaults).map(key => [key, key === "ctaHref" ? safeHref : text])));
const numericText = z.string().refine(value => value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= 0, "Use a non-negative number");
const heroItem = z.object({
  id: text.min(1), title: text.min(1), subtitle: text, subject: text, category: text,
  price: numericText, originalPrice: numericText,
  rating: numericText.refine(value => Number(value) <= 5, "Rating must be between 0 and 5"),
  reviewsCount: numericText.refine(value => Number.isInteger(Number(value)), "Review count must be a whole number"),
  coverType: z.enum(["hindi", "polity", "essay", "history", "constitution", "law", "gk", "economy", "science", "geography"]),
  bgColor: text.min(1), edition: text, badge: text, author: text,
  image: text.refine(value => value === "" || /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value), "Use a site path or HTTP(S) image URL"),
});
export const HERO_ITEM_DEFAULT = {
  id: "", title: "", subtitle: "", subject: "", category: "", price: "0", originalPrice: "0", rating: "0", reviewsCount: "0",
  coverType: "hindi", bgColor: HERO_BOOKS[0].bgColor, edition: "", badge: "", author: "", image: "",
};
export const contentSchemas = {
  hero: z.object({ settings: z.object({ bannerImage: requiredImageUrl.default(HERO_BANNER_DEFAULT) }), items: z.array(heroItem).max(100).refine(items => new Set(items.map(item => item.id)).size === items.length, "Book IDs must be unique") }),
  team: z.object({ settings: settingsSchema(TEAM_SETTINGS), items: z.array(teamItem).max(200) }),
  blog: z.object({ settings: settingsSchema(BLOG_SETTINGS), items: z.array(blogItem).max(500).refine(items => new Set(items.map(item => item.id)).size === items.length, "Article IDs must be unique") }),
};
export const contentDefaults = {
  hero: { settings: { bannerImage: HERO_BANNER_DEFAULT }, items: HERO_BOOKS.map(book => Object.fromEntries(Object.keys(HERO_ITEM_DEFAULT).map(key => [key, String(book[key as keyof typeof book] ?? HERO_ITEM_DEFAULT[key as keyof typeof HERO_ITEM_DEFAULT])]))) },
  team: { settings: TEAM_SETTINGS, items: CORE_TEAM.map(item => ({ ...item, image: item.image ?? "" })) },
  blog: { settings: BLOG_SETTINGS, items: BLOG_POSTS.map(item => ({ ...item, image: item.image ?? "" })) },
};
export type PageKind = keyof typeof contentDefaults;
