import { SiteTemplate } from "../components/site/SiteTemplate";
import { DEMO_DATA } from "../../lib/demoData";

export function DemoSitePage() {
  return <SiteTemplate data={DEMO_DATA} />;
}
