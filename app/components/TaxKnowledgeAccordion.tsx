"use client";

import { useState } from "react";
import { TAX_KNOWLEDGE } from "@/app/data/tax-knowledge";

export default function TaxKnowledgeAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // 카테고리별로 그룹화
  const groupedKnowledge = TAX_KNOWLEDGE.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof TAX_KNOWLEDGE>);

  const categories = Object.keys(groupedKnowledge);

  return (
    <div className="space-y-4" role="region" aria-label="세무 기초 지식">
      {categories.map((category, categoryIndex) => {
        const items = groupedKnowledge[category];
        const isOpen = openIndex === categoryIndex;

        return (
          <div key={category} className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
            <button
              onClick={() => setOpenIndex(isOpen ? null : categoryIndex)}
              aria-expanded={isOpen}
              aria-controls={`knowledge-content-${categoryIndex}`}
              id={`knowledge-trigger-${categoryIndex}`}
              className={`w-full px-6 py-4 min-h-[44px] transition-colors flex items-center justify-between text-left ${
                isOpen ? "bg-blue-50/80" : "bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              <h3 className="font-semibold text-[#1d1d1f]">{category}</h3>
              <svg
                className={`w-5 h-5 text-blue-500 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isOpen && (
              <div id={`knowledge-content-${categoryIndex}`} className="px-6 py-4 bg-white border-t border-slate-100" role="region" aria-labelledby={`knowledge-trigger-${categoryIndex}`}>
                <div className="space-y-4">
                  {items.map((item, itemIndex) => (
                    <div key={itemIndex} className="pb-4 last:pb-0 border-b border-slate-100 last:border-0">
                      <div className="text-sm text-[#86868b] mb-2">
                        <span className="font-medium text-[#6e6e73]">관련 키워드:</span>{" "}
                        {item.keywords.join(", ")}
                      </div>
                      <div className="text-[#424245] whitespace-pre-line leading-relaxed">
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
