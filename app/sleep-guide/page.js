import SleepGuidePage from "@/components/SleepGuidePage";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, sleepGuideSchema } from "@/lib/seo";

export const metadata = pageMetadata("sleepGuide");

export default function SleepGuideRoute() {
  return (
    <>
      <JsonLd data={sleepGuideSchema()} />
      <SleepGuidePage />
    </>
  );
}
