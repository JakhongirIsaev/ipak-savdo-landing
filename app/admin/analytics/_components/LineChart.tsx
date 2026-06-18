// Dependency-free SVG line chart for the admin dashboard. Pure presentational,
// server-renderable (no "use client", no chart library). Scales responsively via
// viewBox + w-full. Used by the Search Growth and Yandex Metrika sections.

export interface ChartSeries {
  label: string;
  points: number[];
  color: string; // any CSS color, e.g. "#03B73D"
}

export function LineChart({
  series,
  height = 120,
  yFormat = (n: number) => n.toLocaleString("ru-RU"),
  emptyLabel = "Пока нет данных",
}: {
  series: ChartSeries[];
  height?: number;
  yFormat?: (n: number) => string;
  emptyLabel?: string;
}) {
  const width = 640;
  const padX = 6;
  const padY = 8;
  const n = Math.max(0, ...series.map((s) => s.points.length));
  const allPoints = series.flatMap((s) => s.points);

  if (n === 0 || allPoints.length === 0) {
    return <div className="py-6 text-sm text-ink-500">{emptyLabel}</div>;
  }

  const max = Math.max(...allPoints, 1);
  const min = Math.min(...allPoints, 0);
  const span = max - min || 1;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const x = (i: number) => (n === 1 ? padX + innerW / 2 : padX + (i / (n - 1)) * innerW);
  const y = (v: number) => padY + innerH - ((v - min) / span) * innerH;

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={series.map((s) => s.label).join(", ")}
      >
        {/* baseline */}
        <line x1={padX} y1={padY + innerH} x2={width - padX} y2={padY + innerH} stroke="#e5ebe6" strokeWidth={1} />
        {series.map((s) => {
          const d = s.points
            .map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
            .join(" ");
          return (
            <path
              key={s.label}
              d={d}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {series.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-ink-700">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.label}:{" "}
            <span className="font-medium tabular-nums text-ink-900">
              {yFormat(s.points[s.points.length - 1] ?? 0)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
