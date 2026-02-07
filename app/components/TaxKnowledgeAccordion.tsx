"use client";

import { useState } from "react";
import { TAX_KNOWLEDGE } from "@/app/data/tax-knowledge";
import {
  Calculator,
  Receipt,
  Building2,
  Shield,
  ChevronDown,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CATEGORY_META: Record<string, { icon: LucideIcon; color: string; bg: string; border: string }> = {
  "종합소득세": { icon: Calculator, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  "부가가치세": { icon: Receipt, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
  "사업자등록": { icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  "기타": { icon: Shield, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
};

export default function TaxKnowledgeAccordion() {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(["종합소득세"]));
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const groupedKnowledge = TAX_KNOWLEDGE.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof TAX_KNOWLEDGE>);

  const categories = Object.keys(groupedKnowledge);

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4" role="region" aria-label="세무 기초 지식">
      {/* 상단 안내 */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-base">개인사업자 기초 세무 지식</h3>
          <p className="text-xs text-slate-400">카테고리를 눌러 자세한 내용을 확인하세요</p>
        </div>
      </div>

      {categories.map((category) => {
        const items = groupedKnowledge[category];
        const isOpen = openCategories.has(category);
        const meta = CATEGORY_META[category] || CATEGORY_META["기타"];
        const Icon = meta.icon;

        return (
          <div
            key={category}
            className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
              isOpen ? `${meta.border} shadow-sm` : "border-slate-100 hover:border-slate-200"
            }`}
          >
            {/* 카테고리 헤더 */}
            <button
              onClick={() => toggleCategory(category)}
              className={`w-full px-5 py-4 flex items-center gap-3 text-left transition-all duration-300 ${
                isOpen ? `${meta.bg}` : "bg-white hover:bg-slate-50"
              }`}
            >
              <span className={`w-9 h-9 rounded-xl ${meta.bg} ${meta.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4.5 h-4.5" strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 text-[15px]">{category}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{items.length}개 항목</p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* 아이템 리스트 */}
            <div className={`grid transition-all duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="px-5 py-4 bg-white space-y-3 border-t border-slate-100/80">
                  {items.map((item) => {
                    const isExpanded = expandedItems.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border transition-all duration-300 ${
                          isExpanded
                            ? `${meta.border} ${meta.bg}/30 shadow-sm`
                            : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                        }`}
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full px-4 py-3.5 flex items-start gap-3 text-left"
                        >
                          <span className={`w-6 h-6 rounded-lg ${meta.bg} ${meta.color} flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold`}>
                            {item.id.charAt(0).toUpperCase()}
                          </span>
                          <div className="flex-1 min-w-0">
                            {/* 키워드 칩 */}
                            <div className="flex flex-wrap gap-1.5 mb-1.5">
                              {item.keywords.slice(0, 3).map((kw) => (
                                <span
                                  key={kw}
                                  className={`inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}
                                >
                                  {kw}
                                </span>
                              ))}
                              {item.keywords.length > 3 && (
                                <span className="text-[11px] text-slate-400">+{item.keywords.length - 3}</span>
                              )}
                            </div>
                            {/* 미리보기 */}
                            {!isExpanded && (
                              <p className="text-sm text-slate-500 line-clamp-1">
                                {item.content.split("\n")[0]}
                              </p>
                            )}
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-300 transition-transform duration-300 flex-shrink-0 mt-1 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* 상세 내용 */}
                        <div className={`grid transition-all duration-400 ease-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                          <div className="overflow-hidden">
                            <div className="px-4 pb-4 pt-0">
                              <div className="bg-white rounded-xl p-4 border border-slate-100">
                                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                  {item.content}
                                </div>
                                {/* 출처 */}
                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                                  <ExternalLink className="w-3 h-3 text-slate-300" />
                                  <span className="text-[11px] text-slate-400">근거: {item.source}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
