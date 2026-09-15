import Content from "@/components/TeamContent";
import { getPageContent } from "@/lib/page-content";

export default async function Page() {
  const content = await getPageContent("team");
  return <Content settings={content.settings} items={content.items} />;
}
