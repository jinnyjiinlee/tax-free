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
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TaxChartsProps {
  result: DiagnosisResult;
}

const COLORS = ["#3182F6", "#60a5fa", "#3b82f6", "#f59e0b"];

export function MonthlyTaxChart({ result }: TaxChartsProps) {
  const monthlyRevenue = {
    "under-500": 300,
    "500-2000": 1250,
    "2000-5000": 3500,
    "over-5000": 6000,
  }[result.answers.monthlyRevenue];

  const monthlyIncomeTax = Math.floor(result.estimatedIncomeTax / 12);
  const monthlyVAT = Math.floor(result.estimatedVAT / 12);
  const monthlyInsurance = Math.floor(result.estimatedInsurance / 12);

  const data = [
    { month: "1월", 세금: monthlyIncomeTax + monthlyVAT + monthlyInsurance },
    { month: "2월", 세금: monthlyIncomeTax + monthlyVAT + monthlyInsurance },
    { month: "3월", 세금: monthlyIncomeTax + monthlyVAT + monthlyInsurance },
    { month: "4월", 세금: monthlyIncomeTax + monthlyVAT + monthlyInsurance },
    { month: "5월", 세금: monthlyIncomeTax + monthlyVAT + monthlyInsurance },
    { month: "6월", 세금: monthlyIncomeTax + monthlyVAT + monthlyInsurance },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100" role="img" aria-label="월별 예상 세금 차트">
      <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">월별 예상 세금</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="세금" fill="#3182F6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TaxCompositionChart({ result }: TaxChartsProps) {
  const data = [
    { name: "종합소득세", value: result.estimatedIncomeTax },
    { name: "부가가치세", value: result.estimatedVAT },
    { name: "4대보험", value: result.estimatedInsurance },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100" role="img" aria-label="세금 구성 비율 차트">
      <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">세금 구성 비율</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value.toLocaleString()}만원`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TaxComparisonChart({ result }: TaxChartsProps) {
  const beforeOptimization = result.estimatedIncomeTax + result.estimatedVAT + result.estimatedInsurance;
  const afterOptimization = Math.floor(beforeOptimization * 0.85); // 15% 절세 가정

  const data = [
    { name: "절세 전", 세금: beforeOptimization },
    { name: "절세 후", 세금: afterOptimization },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100" role="img" aria-label="절세 전후 비교 차트">
      <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">절세 전후 비교</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            formatter={(value: number) => `${value.toLocaleString()}만원`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="세금" fill="#3182F6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-[#6e6e73] text-center font-normal">
        예상 절세액: <span className="font-semibold text-blue-600">{(beforeOptimization - afterOptimization).toLocaleString()}만원</span>
      </div>
    </div>
  );
}
