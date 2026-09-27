import React, { useState } from 'react';

// --- Tooltip & Utilities ---
export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

// 1. Dual Bar Chart (e.g. Revenue vs Expenses or Current vs Simulated)
export function DualBarChart({
  data,
  primaryColor = '#3B82F6',
  secondaryColor = '#EF4444',
  primaryLabel = 'Revenue',
  secondaryLabel = 'Expenses',
  formatValue = (v: number) => `₹${v.toLocaleString('en-IN')}`,
  height = 240,
}: {
  data: ChartDataPoint[];
  primaryColor?: string;
  secondaryColor?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  formatValue?: (val: number) => string;
  height?: number;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No chart data available</div>;
  }

  const maxVal = Math.max(
    ...data.map(d => Math.max(d.value || 0, d.secondaryValue || 0)),
    1000
  ) * 1.15;

  const barWidth = 14;
  const gap = 4;
  const groupWidth = barWidth * 2 + gap + 16;
  const totalWidth = Math.max(500, data.length * groupWidth);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center gap-6 mb-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: primaryColor }} />
          <span>{primaryLabel}</span>
        </div>
        {secondaryLabel && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: secondaryColor }} />
            <span>{secondaryLabel}</span>
          </div>
        )}
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${totalWidth} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Horizontal gridlines */}
          {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1="0"
              y1={height - 30 - (height - 50) * ratio}
              x2={totalWidth}
              y2={height - 30 - (height - 50) * ratio}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
              strokeDasharray="4 4"
            />
          ))}

          {/* Bars */}
          {data.map((d, idx) => {
            const x = idx * groupWidth + 20;
            const primaryHeight = Math.max(4, ((d.value || 0) / maxVal) * (height - 50));
            const secondaryHeight = Math.max(4, ((d.secondaryValue || 0) / maxVal) * (height - 50));
            const y1 = height - 30 - primaryHeight;
            const y2 = height - 30 - secondaryHeight;

            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer transition-opacity"
              >
                {/* Background highlight on hover */}
                {isHovered && (
                  <rect
                    x={x - 6}
                    y="10"
                    width={groupWidth - 4}
                    height={height - 35}
                    className="fill-slate-100 dark:fill-slate-800/60"
                    rx="4"
                  />
                )}

                {/* Primary Bar */}
                <rect
                  x={x}
                  y={y1}
                  width={barWidth}
                  height={primaryHeight}
                  fill={primaryColor}
                  rx="3"
                  className="transition-all duration-200"
                />

                {/* Secondary Bar */}
                {d.secondaryValue !== undefined && (
                  <rect
                    x={x + barWidth + gap}
                    y={y2}
                    width={barWidth}
                    height={secondaryHeight}
                    fill={secondaryColor}
                    rx="3"
                    className="transition-all duration-200"
                  />
                )}

                {/* X-axis Label */}
                <text
                  x={x + barWidth}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-500 font-medium"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs"
            style={{
              top: '10px',
              left: `${Math.min(85, Math.max(10, ((hoveredIdx + 0.5) / data.length) * 100))}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-semibold text-slate-200 mb-1">{data[hoveredIdx].label}</div>
            <div className="flex items-center justify-between gap-4 text-emerald-400">
              <span>{primaryLabel}:</span>
              <span className="font-bold">{formatValue(data[hoveredIdx].value)}</span>
            </div>
            {data[hoveredIdx].secondaryValue !== undefined && (
              <div className="flex items-center justify-between gap-4 text-rose-400 mt-0.5">
                <span>{secondaryLabel}:</span>
                <span className="font-bold">{formatValue(data[hoveredIdx].secondaryValue!)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 2. Interactive Area Trend Chart
export function AreaTrendChart({
  data,
  color = '#2563EB',
  height = 200,
  formatValue = (v: number) => `₹${v.toLocaleString('en-IN')}`,
}: {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
}) {
  const [activePoint, setActivePoint] = useState<{ label: string; value: number; x: number; y: number } | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const paddingX = 30;
  const paddingY = 25;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const maxVal = Math.max(...data.map(d => d.value), 100) * 1.1;
  const minVal = Math.min(...data.map(d => d.value), 0);
  const range = maxVal - minVal || 1;

  const points = data.map((d, idx) => {
    const x = paddingX + (idx / (data.length - 1 || 1)) * chartW;
    const y = height - paddingY - ((d.value - minVal) / range) * chartH;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Fill Area */}
        <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Point Circles */}
        {points.map((p, idx) => (
          <g key={idx} className="cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              className="fill-white dark:fill-slate-900 hover:r-6 transition-all"
              stroke={color}
              strokeWidth="2"
              onMouseEnter={() => setActivePoint(p)}
              onMouseLeave={() => setActivePoint(null)}
            />
          </g>
        ))}

        {/* X labels */}
        {points.map((p, idx) => (
          <text
            key={idx}
            x={p.x}
            y={height - 6}
            textAnchor="middle"
            className="text-[10px] fill-slate-500 font-medium"
          >
            {p.label}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      {activePoint && (
        <div
          className="absolute z-20 pointer-events-none bg-slate-900 text-white px-2.5 py-1.5 rounded-md shadow-lg text-xs"
          style={{
            left: `${(activePoint.x / width) * 100}%`,
            top: `${Math.max(10, activePoint.y - 40)}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="text-[10px] text-slate-300 font-medium">{activePoint.label}</div>
          <div className="font-bold text-white">{formatValue(activePoint.value)}</div>
        </div>
      )}
    </div>
  );
}

// 3. Interactive Donut Chart for Categories
export function DonutChart({
  data,
  height = 180,
}: {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const colors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'];
  const total = data.reduce((acc, cur) => acc + cur.value, 0) || 1;

  let currentAngle = 0;
  const slices = data.map((d, idx) => {
    const sliceAngle = (d.value / total) * 360;
    const start = currentAngle;
    const end = currentAngle + sliceAngle;
    currentAngle += sliceAngle;
    return {
      ...d,
      color: d.color || colors[idx % colors.length],
      start,
      end,
      pct: Math.round((d.value / total) * 100),
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
      <div className="relative" style={{ width: height, height }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {slices.map((slice, idx) => {
            const startRad = (slice.start * Math.PI) / 180;
            const endRad = (slice.end * Math.PI) / 180;
            const x1 = 50 + 38 * Math.cos(startRad);
            const y1 = 50 + 38 * Math.sin(startRad);
            const x2 = 50 + 38 * Math.cos(endRad);
            const y2 = 50 + 38 * Math.sin(endRad);
            const largeArc = slice.end - slice.start > 180 ? 1 : 0;
            const d = `M 50 50 L ${x1} ${y1} A 38 38 0 ${largeArc} 1 ${x2} ${y2} Z`;

            const isHovered = hoveredIdx === idx;

            return (
              <path
                key={idx}
                d={d}
                fill={slice.color}
                opacity={hoveredIdx !== null && !isHovered ? 0.4 : 1}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
          {/* Inner cutout for donut */}
          <circle cx="50" cy="50" r="24" className="fill-white dark:fill-slate-900 transition-colors" />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Total</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {hoveredIdx !== null ? `${slices[hoveredIdx].pct}%` : `${data.length} Types`}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex flex-col gap-1.5 text-xs">
        {slices.map((slice, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between gap-4 p-1 rounded transition-colors ${
              hoveredIdx === idx
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300'
            }`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="truncate max-w-[120px]">{slice.label}</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">{slice.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
