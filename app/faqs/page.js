import FaqPage from "@/components/FaqPage";
import JsonLd from "@/components/JsonLd";
import { faqsSchema, pageMetadata } from "@/lib/seo";
import { publicFaqService } from "@/services/public-faq.service";

export const metadata = pageMetadata("faqs");

export default async function FaqsRoute() {
  let initialFaqs = null;
  try {
    const res = await publicFaqService.getFaqs({ page: 1, per_page: 50 });
    initialFaqs = res?.data || res || null;
  } catch (err) {
    console.error("Failed to fetch initial FAQs on server:", err?.message);
  }

  return (
    <>
      <JsonLd data={faqsSchema()} />
      <FaqPage initialFaqs={initialFaqs} />
    </>
  );
}
