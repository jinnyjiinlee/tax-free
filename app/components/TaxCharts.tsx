"use client";

import { DiagnosisResult } from "@/app/types/diagnosis";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TaxChartsProps {
  result: DiagnosisResult;
}

const COLORS = {
  incomeTax: "#3182F6",
  vat: "#8B5CF6",
  insurance: "#10B981",
};

/** 월별 세금 납부 일정 (스택 바차트) */
export function MonthlyTaxChart({ result }: TaxChartsProps) {
  const monthlyInsurance = result.estimatedInsurance > 0
    ? Math.floor(result.estimatedInsurance / 12)
    : 0;
  const monthlyTotal = Math.floor(
    (result.estimatedIncomeTax + result.estimatedVAT + result.estimatedInsurance) / 12
  );

  const vatMonths = result.reportSchedule.vat;
  const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  const data = months.map((m) => {
    const isVatMonth = vatMonths.includes(m);
    const isIncomeTaxMonth = m === result.reportSchedule.incomeTax;
    return {
      month: `${m}월`,
      종합소득세: isIncomeTaxMonth ? result.estimatedIncomeTax : 0,
      부가가치세: isVatMonth ? Math.floor(result.estimatedVAT / vatMonths.length) : 0,
      "4대보험": monthlyInsurance,
    };
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#1d1d1f]">월별 세금 납부 일정</h3>
        <p className="text-sm text-slate-500 mt-1">
          실제 납부 시기에 맞춰 월별로 얼마를 준비해야 하는지 보여드려요
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}만`} />
          <Tooltip
            formatter={(value: number, name: string) => [`${value.toLocaleString()}만원`, name]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
            }}
          />
          <Legend iconType="circle" iconSize={8} />
          <Bar dataKey="종합소득세" stackId="tax" fill={COLORS.incomeTax} />
          <Bar dataKey="부가가치세" stackId="tax" fill={COLORS.vat} />
          <Bar dataKey="4대보험" stackId="tax" fill={COLORS.insurance} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          매월 약 <span className="font-semibold text-slate-700">{monthlyTotal.toLocaleString()}만원</span>씩 준비하면 납부 시기에 부담이 줄어요
        </p>
      </div>
    </div>
  );
}

/** 세금 구성 비율 (도넛 차트 + 범례) */
export function TaxCompositionChart({ result }: TaxChartsProps) {
  const total = result.estimatedIncomeTax + result.estimatedVAT + result.estimatedInsurance;

  const data = [
    { name: "종합소득세", value: result.estimatedIncomeTax, color: COLORS.incomeTax },
    { name: "부가가치세", value: result.estimatedVAT, color: COLORS.vat },
    { name: "4대보험", value: result.estimatedInsurance, color: COLORS.insurance },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#1d1d1f]">세금 구성 비율</h3>
        <p className="text-sm text-slate-500 mt-1">
          전체 세금 중 어떤 항목이 가장 큰 비중을 차지하는지 확인하세요
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <ResponsiveContainer width="100%" height={220} className="sm:max-w-[220px]">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()}만원`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* 범례 + 금액 */}
        <div className="flex-1 w-full space-y-3">
          {data.map((item) => {
            const percent = total > 0 ? ((item.value / total) * 100).toFixed(0) : "0";
            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-900">{item.value.toLocaleString()}만원</span>
                  <span className="text-xs text-slate-400 ml-1.5">({percent}%)</span>
                </div>
              </div>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">연간 총 세금</span>
            <span className="text-base font-bold text-[#1d1d1f]">{total.toLocaleString()}만원</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 절세 전후 비교 + 절세 팁 */
export function TaxComparisonChart({ result }: TaxChartsProps) {
  const beforeOptimization = result.estimatedIncomeTax + result.estimatedVAT + result.estimatedInsurance;
  const afterOptimization = Math.floor(beforeOptimization * 0.85);
  const saving = beforeOptimization - afterOptimization;

  const data = [
    { name: "현재 예상", 세금: beforeOptimization },
    { name: "절세 적용 시", 세금: afterOptimization },
  ];

  const tips = getTaxTips(result);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#1d1d1f]">절세 시뮬레이션</h3>
        <p className="text-sm text-slate-500 mt-1">
          경비처리와 절세 전략을 적용하면 약 15%까지 줄일 수 있어요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 차트 */}
        <div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}만`} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 13, fontWeight: 500 }} width={90} />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString()}만원`, "세금"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                }}
              />
              <Bar dataKey="세금" radius={[0, 8, 8, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#cbd5e1" : COLORS.incomeTax} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-center gap-3 mt-2 py-3 bg-blue-50 rounded-xl">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-semibold text-blue-700">
              예상 절세액: 연 {saving.toLocaleString()}만원
            </span>
          </div>
        </div>

        {/* 절세 팁 */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            맞춤 절세 팁
          </h4>
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">{tip.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 진단 결과 기반 맞춤 절세 팁 생성 */
function getTaxTips(result: DiagnosisResult) {
  const tips: { title: string; description: string }[] = [];
  const { answers } = result;

  // 업종별 팁
  if (answers.industry === "freelancer") {
    tips.push({
      title: "프리랜서 경비처리 활용",
      description: "통신비, 교통비, 장비 구매비 등을 사업 경비로 처리하면 과세 소득이 줄어요",
    });
  } else if (answers.industry === "food-store") {
    tips.push({
      title: "식재료비 매입세액 공제",
      description: "세금계산서를 꼼꼼히 받으면 부가세 신고 시 매입세액을 공제받을 수 있어요",
    });
  } else if (answers.industry === "retail") {
    tips.push({
      title: "재고 관리로 경비 최적화",
      description: "매입 증빙을 체계적으로 관리하면 경비처리 폭이 넓어져요",
    });
  } else {
    tips.push({
      title: "사업용 지출 경비처리",
      description: "사업에 필요한 지출은 빠짐없이 경비처리하면 세금을 줄일 수 있어요",
    });
  }

  // 과세 유형별 팁
  if (result.taxType === "simplified") {
    tips.push({
      title: "간이과세자 혜택 활용",
      description: "연매출 4,800만원 미만이면 부가세 납부 면제 혜택이 있어요",
    });
  } else if (result.taxType === "general") {
    tips.push({
      title: "매입세액 공제 극대화",
      description: "일반과세자는 사업용 매입에 대한 부가세를 돌려받을 수 있어요",
    });
  } else {
    tips.push({
      title: "면세사업자 혜택",
      description: "면세사업자는 부가세가 면제되지만, 매입세액 공제도 안 되니 유의하세요",
    });
  }

  // 장부 관리 팁
  if (answers.bookkeeping === "none" || answers.bookkeeping === "unknown") {
    tips.push({
      title: "장부 작성 시작하기",
      description: "복식부기 장부를 작성하면 기장세액공제 20%를 받을 수 있어요",
    });
  }

  // 직원 관련 팁
  if (answers.employeeCount > 0) {
    tips.push({
      title: "고용 관련 세액공제",
      description: "직원 고용 시 사회보험료 세액공제, 고용증대 세액공제를 확인하세요",
    });
  }

  return tips.slice(0, 4);
}
