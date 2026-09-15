import Content from "@/components/BlogContent";
import { getPageContent } from "@/lib/page-content";

export default async function Page() {
  const content = await getPageContent("blog");
  return <Content settings={content.settings} items={content.items} />;
}
