import type { LucideIcon } from "lucide-react";
import {
  Trophy,
  GraduationCap,
  Scale,
  Landmark,
  Award,
  BookOpen,
  FileText,
  Flame,
  Globe,
  Feather,
  PenTool,
  Sparkles,
  Layers,
  Tag,
} from "lucide-react";

export const NAV_ICONS: Record<string, LucideIcon> = {
  trophy: Trophy,
  "graduation-cap": GraduationCap,
  scale: Scale,
  landmark: Landmark,
  award: Award,
  book: BookOpen,
  file: FileText,
  flame: Flame,
  globe: Globe,
  feather: Feather,
  pen: PenTool,
  sparkles: Sparkles,
  layers: Layers,
  tag: Tag,
};
export const DEFAULT_NAV_ICON = "tag";
export const NAV_ICON_KEYS = Object.keys(NAV_ICONS);

export const NAV_COLORS: Record<string, { iconBg: string; iconColor: string; badgeColor: string; swatch: string }> = {
  brand: { iconBg: "bg-red-50", iconColor: "text-[#C61821]", badgeColor: "bg-[#C61821] text-white", swatch: "bg-[#C61821]" },
  amber: { iconBg: "bg-amber-50", iconColor: "text-amber-600", badgeColor: "bg-amber-500 text-white", swatch: "bg-amber-500" },
  blue: { iconBg: "bg-blue-50", iconColor: "text-blue-600", badgeColor: "bg-blue-600 text-white", swatch: "bg-blue-600" },
  indigo: { iconBg: "bg-indigo-50", iconColor: "text-indigo-600", badgeColor: "bg-indigo-600 text-white", swatch: "bg-indigo-600" },
  emerald: { iconBg: "bg-emerald-50", iconColor: "text-emerald-600", badgeColor: "bg-emerald-600 text-white", swatch: "bg-emerald-600" },
  purple: { iconBg: "bg-purple-50", iconColor: "text-purple-600", badgeColor: "bg-purple-600 text-white", swatch: "bg-purple-600" },
  orange: { iconBg: "bg-orange-50", iconColor: "text-orange-600", badgeColor: "bg-orange-600 text-white", swatch: "bg-orange-600" },
  teal: { iconBg: "bg-teal-50", iconColor: "text-teal-600", badgeColor: "bg-teal-600 text-white", swatch: "bg-teal-600" },
  sky: { iconBg: "bg-sky-50", iconColor: "text-sky-600", badgeColor: "bg-sky-600 text-white", swatch: "bg-sky-600" },
  pink: { iconBg: "bg-pink-50", iconColor: "text-pink-600", badgeColor: "bg-pink-600 text-white", swatch: "bg-pink-600" },
  yellow: { iconBg: "bg-yellow-50", iconColor: "text-yellow-600", badgeColor: "bg-yellow-600 text-white", swatch: "bg-yellow-600" },
  rose: { iconBg: "bg-rose-50", iconColor: "text-rose-600", badgeColor: "bg-rose-600 text-white", swatch: "bg-rose-600" },
};
export const DEFAULT_NAV_COLOR = "brand";
export const NAV_COLOR_KEYS = Object.keys(NAV_COLORS);

export type NavGroupId = "exams" | "academic" | "leisure";
export const NAV_GROUPS: { id: NavGroupId; label: string; hindiLabel: string }[] = [
  { id: "exams", label: "EXAMS", hindiLabel: "प्रतियोगी परीक्षाएँ" },
  { id: "academic", label: "ACADEMIC", hindiLabel: "विधि एवं शैक्षणिक" },
  { id: "leisure", label: "LEISURE", hindiLabel: "साहित्य एवं अन्य" },
];
