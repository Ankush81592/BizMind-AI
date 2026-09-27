import React, { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  subtext?: string;
  isCurrency?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  subtext,
}: MetricCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
        <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</div>

        <div className="flex items-center gap-2 mt-2 text-xs">
          {change !== undefined && (
            <span
              className={`flex items-center font-medium ${
                isPositive ? 'text-emerald-600 dark:text-emerald-400' : isNegative ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 inline" />
              ) : isNegative ? (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 inline" />
              ) : (
                <Minus className="w-3.5 h-3.5 mr-0.5 inline" />
              )}
              {isPositive ? '+' : ''}
              {change}%
            </span>
          )}
          <span className="text-slate-500 dark:text-slate-400 truncate">{subtext || changeLabel}</span>
        </div>
      </div>
    </div>
  );
}
