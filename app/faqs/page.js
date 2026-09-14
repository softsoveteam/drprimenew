import FaqPage from "@/components/FaqPage";
import JsonLd from "@/components/JsonLd";
import { faqsSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("faqs");

export default function FaqsRoute() {
  return (
    <>
      <JsonLd data={faqsSchema()} />
      <FaqPage />
    </>
  );
}
