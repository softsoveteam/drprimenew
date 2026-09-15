"use client";

import { useState } from "react";
import PageTicker from "@/components/PageTicker";
import { usePublicFaqs } from "@/hooks/usePublicFaqs";
import { FAQ_CATEGORIES, FAQS as FALLBACK_FAQS } from "@/lib/content";
import { Search, Loader2 } from "lucide-react";

export default function FaqPage() {
  const [cat, setCat] = useState("quality");
  const [open, setOpen] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: faqsData, isLoading } = usePublicFaqs({
    search: searchQuery,
    page: 1,
    per_page: 50,
  });

  const apiFaqs = faqsData?.data || [];
  const hasApiFaqs = apiFaqs.length > 0;

  // Static fallback filtering if API returned empty
  const fallbackItems = FALLBACK_FAQS.filter((faq) => faq.cat === cat);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-3" data-cursor="-opaque">
                  Frequently asked questions
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      FAQs
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageTicker />

      <section className="dp-faq-page">
        <div className="container">
          <div className="dp-faq-intro">
            <h3>Support & FAQs</h3>
            <h2>Find answers to memory foam care instructions, sleep positions, and cleaning guidelines for your Dr.Prime Pillow cervical pillow.</h2>

            {/* Real-time Search Box */}
            <div className="mt-6 max-w-xl mx-auto relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-[#1d1c50]/50 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search questions or keywords..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setOpen(0);
                  }}
                  className="w-full h-14 pl-12 pr-10 rounded-2xl bg-white border border-[#1d1c50]/15 text-[#1d1c50] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1d1c50] text-base placeholder:text-[#4a4a6a]/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setOpen(0);
                    }}
                    className="absolute right-4 text-xs font-semibold text-[#4a4a6a] hover:text-[#1d1c50] bg-[#f8f5ed] px-2 py-1 rounded-md"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {!searchQuery && !hasApiFaqs && (
            <div className="dp-faq-cats">
              {FAQ_CATEGORIES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={cat === item.key ? "is-active" : ""}
                  onClick={() => {
                    setCat(item.key);
                    setOpen(0);
                  }}
                >
                  <img src={item.icon} alt={item.label} />
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#1d1c50]" />
              <p className="text-sm font-medium text-[#4a4a6a]">Loading FAQs...</p>
            </div>
          ) : (
            <div className="dp-faq-list">
              {hasApiFaqs ? (
                apiFaqs.map((faq, i) => (
                  <article key={faq.id || i} className={`dp-faq-item${open === i ? " is-open" : ""}`}>
                    <button type="button" onClick={() => setOpen(open === i ? -1 : i)}>
                      <h3>{faq.question}</h3>
                      <i className={`fa-solid fa-chevron-${open === i ? "up" : "down"}`}></i>
                    </button>
                    {open === i ? (
                      <div className="dp-faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    ) : null}
                  </article>
                ))
              ) : fallbackItems.length > 0 ? (
                fallbackItems.map((faq, i) => (
                  <article key={faq.q || i} className={`dp-faq-item${open === i ? " is-open" : ""}`}>
                    <button type="button" onClick={() => setOpen(open === i ? -1 : i)}>
                      <h3>{faq.q}</h3>
                      <i className={`fa-solid fa-chevron-${open === i ? "up" : "down"}`}></i>
                    </button>
                    {open === i ? (
                      faq.bullets ? (
                        <div className="dp-faq-answer">
                          <p>{faq.intro}</p>
                          <ul>
                            {faq.bullets.map((bullet) => (
                              <li key={bullet.title}>
                                <strong>{bullet.title}:</strong> {bullet.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p>{faq.a}</p>
                      )
                    ) : null}
                  </article>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#4a4a6a] font-medium">No FAQs found matching your search query.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
