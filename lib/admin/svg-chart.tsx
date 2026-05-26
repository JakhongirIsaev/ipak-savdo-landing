import type { DailyBySource } from "./kpi";
import type { LeadStatus } from "@/lib/db/schema";
import { STATUS_META } from "./status-meta";

const SOURCE_COLORS = ["#03B73D", "#7ED99A", "#3B4756", "#6B7682", "#E8EBE5"];
const SOURCE_FALLBACK = "#0B1826";

interface StackedBarsProps {
  data: DailyBySource[];
  width: number;
  height: number;
}

export function StackedBars({ data, width, height }: StackedBarsProps) {
  const padding = { top: 16, right: 8, bottom: 24, left: 32 };
  const days = Array.from(new Set(data.map((d) => d.day))).sort();
  const sources = Array.from(new Set(data.map((d) => d.source)));

  const sourceColor = (s: string) => {
    const idx = sources.indexOf(s);
    return idx < SOURCE_COLORS.length ? SOURCE_COLORS[idx] : SOURCE_FALLBACK;
  };

  const totals = days.map((day) =>
    data.filter((d) => d.day === day).reduce((sum, d) => sum + d.count, 0),
  );
  const maxTotal = Math.max(1, ...totals);

  const colWidth = days.length === 0 ? 0 : (width - padding.left - padding.right) / days.length;
  const barWidth = Math.max(2, colWidth - 2);
  const plotHeight = height - padding.top - padding.bottom;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Лиды по дням за последние ${days.length} дн.`}
      className="block"
    >
      {[0.25, 0.5, 0.75, 1].map((frac, i) => {
        const y = padding.top + plotHeight * (1 - frac);
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y}
              stroke="#E8EBE5" strokeWidth={1} />
            <text x={padding.left - 4} y={y + 3} textAnchor="end"
              fontSize="10" fill="#6B7682" fontFamily="var(--font-body)">
              {Math.round(maxTotal * frac)}
            </text>
          </g>
        );
      })}

      {days.map((day, i) => {
        const dayData = data.filter((d) => d.day === day);
        const x = padding.left + i * colWidth + 1;
        let yCursor = padding.top + plotHeight;
        return (
          <g key={day} className="day">
            {dayData.map((d) => {
              const h = (d.count / maxTotal) * plotHeight;
              yCursor -= h;
              return (
                <rect
                  key={d.source}
                  x={x}
                  y={yCursor}
                  width={barWidth}
                  height={h}
                  fill={sourceColor(d.source)}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

interface FunnelProps {
  data: { status: LeadStatus; count: number }[];
  width: number;
}

export function Funnel({ data, width }: FunnelProps) {
  const total = data[0]?.count ?? 0;
  const rowHeight = 32;
  const gap = 6;
  const labelW = 110;
  const barX = labelW + 8;
  const barW = width - barX - 90;
  const height = data.length * (rowHeight + gap) + 8;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Воронка по статусам лидов"
      className="block"
    >
      {data.map((row, i) => {
        const meta = STATUS_META[row.status];
        const pct = total === 0 ? 0 : Math.round((row.count / total) * 100);
        const w = total === 0 ? 0 : (row.count / total) * barW;
        const y = i * (rowHeight + gap);
        const fill = row.status === "won" ? "#03B73D" : "#3B4756";
        return (
          <g key={row.status} className="row">
            <text x={0} y={y + 20} fontSize="13" fill="#0B1826" fontFamily="var(--font-body)" fontWeight={500}>
              {meta.emoji} {meta.label}
            </text>
            <rect x={barX} y={y + 4} width={barW} height={rowHeight - 4} fill="#F6F7F4" />
            <rect x={barX} y={y + 4} width={w} height={rowHeight - 4} fill={fill} />
            <text x={width - 4} y={y + 20} textAnchor="end" fontSize="13" fill="#0B1826" fontFamily="var(--font-body)">
              {row.count} <tspan fill="#6B7682">{`(${pct}%)`}</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}
