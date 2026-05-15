import { motion } from "framer-motion";

export type VisualKind =
  | "amazon"
  | "nike"
  | "health"
  | "education"
  | "demand"
  | "unemployment"
  | "crop"
  | "spotify";

const palettes: Record<VisualKind, [string, string, string]> = {
  amazon: ["#00A8E1", "#1A98FF", "#7B61FF"],
  nike: ["#FA5400", "#FFB800", "#FF2E63"],
  health: ["#22D3EE", "#10B981", "#F472B6"],
  education: ["#A78BFA", "#60A5FA", "#34D399"],
  demand: ["#FBBF24", "#F472B6", "#22D3EE"],
  unemployment: ["#F87171", "#FBBF24", "#60A5FA"],
  crop: ["#34D399", "#FBBF24", "#A3E635"],
  spotify: ["#1DB954", "#1ED760", "#22D3EE"],
};

// deterministic pseudo-random helper
const rand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export function ProjectVisual({ kind }: { kind: VisualKind }) {
  const [c1, c2, c3] = palettes[kind];

  const renderInner = () => {
    switch (kind) {
      case "amazon": {
        // stacked bars
        const data = [[20, 30, 25], [35, 25, 20], [15, 40, 30], [40, 30, 15], [25, 35, 25], [30, 20, 40], [20, 45, 20]];
        return (
          <g>
            {data.map((stack, i) => {
              let acc = 170;
              return stack.map((h, j) => {
                acc -= h;
                return (
                  <motion.rect
                    key={`${i}-${j}`}
                    x={20 + i * 26}
                    width={18}
                    rx={2}
                    fill={[c1, c2, c3][j]}
                    initial={{ y: 170, height: 0 }}
                    animate={{ y: acc, height: h }}
                    transition={{ duration: 0.7, delay: i * 0.08 + j * 0.05 }}
                  />
                );
              });
            })}
          </g>
        );
      }
      case "nike": {
        // animated line + area chart
        const pts = [10, 40, 25, 70, 55, 90, 75, 110, 60, 100, 80, 130];
        const path = pts.map((y, i) => `${i === 0 ? "M" : "L"} ${15 + i * 18} ${170 - y}`).join(" ");
        return (
          <g>
            <motion.path
              d={`${path} L ${15 + (pts.length - 1) * 18} 180 L 15 180 Z`}
              fill={`${c1}33`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.path
              d={path}
              fill="none"
              stroke={c1}
              strokeWidth={3}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
            {pts.map((y, i) => (
              <motion.circle
                key={i}
                cx={15 + i * 18}
                cy={170 - y}
                r={3.5}
                fill={c2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
              />
            ))}
          </g>
        );
      }
      case "health": {
        // donut with center pulse
        const slices = [38, 27, 20, 15];
        const colors = [c1, c2, c3, "#ffffff"];
        let cum = 0;
        const cx = 110, cy = 95, r = 55;
        return (
          <g>
            {slices.map((s, i) => {
              const start = (cum / 100) * Math.PI * 2 - Math.PI / 2;
              cum += s;
              const end = (cum / 100) * Math.PI * 2 - Math.PI / 2;
              const x1 = cx + r * Math.cos(start);
              const y1 = cy + r * Math.sin(start);
              const x2 = cx + r * Math.cos(end);
              const y2 = cy + r * Math.sin(end);
              const large = s > 50 ? 1 : 0;
              return (
                <motion.path
                  key={i}
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
                  fill={colors[i]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                />
              );
            })}
            <circle cx={cx} cy={cy} r={28} fill="#0f172a" />
            <motion.circle
              cx={cx} cy={cy} r={28}
              fill="none" stroke={c1} strokeWidth={1.5}
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </g>
        );
      }
      case "education": {
        // funnel chart (distinct from donut)
        const tiers = [
          { w: 180, label: "Enrolled" },
          { w: 145, label: "Active" },
          { w: 100, label: "Promoted" },
          { w: 60, label: "Graduated" },
        ];
        return (
          <g>
            {tiers.map((t, i) => (
              <motion.rect
                key={i}
                x={(220 - t.w) / 2}
                y={20 + i * 36}
                width={t.w}
                height={28}
                rx={6}
                fill={[c1, c2, c3, c1][i]}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.85, scaleX: 1 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                style={{ transformOrigin: "110px center" }}
              />
            ))}
          </g>
        );
      }
      case "demand": {
        // dual line forecast with dashed projection
        const actual = [30, 50, 45, 70, 60, 85, 95];
        const forecast = [95, 110, 100, 125];
        const ap = actual.map((y, i) => `${i === 0 ? "M" : "L"} ${15 + i * 22} ${170 - y}`).join(" ");
        const fp = `M ${15 + (actual.length - 1) * 22} ${170 - actual[actual.length - 1]} ` +
          forecast.map((y, i) => `L ${15 + (actual.length + i) * 22} ${170 - y}`).join(" ");
        return (
          <g>
            <motion.path d={ap} fill="none" stroke={c1} strokeWidth={3} strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
            <motion.path d={fp} fill="none" stroke={c2} strokeWidth={3} strokeDasharray="5 5" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />
            {[...actual, ...forecast].map((y, i) => (
              <motion.circle key={i} cx={15 + i * 22} cy={170 - y} r={4}
                fill={i < actual.length ? c1 : c3}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }} />
            ))}
          </g>
        );
      }
      case "unemployment": {
        // deterministic heatmap (no Math.random — fixes hydration)
        return (
          <g>
            {Array.from({ length: 6 }).map((_, r) =>
              Array.from({ length: 10 }).map((_, c) => {
                const v = rand(r * 13.7 + c * 3.1);
                const color = v > 0.66 ? c1 : v > 0.33 ? c2 : c3;
                return (
                  <motion.rect
                    key={`${r}-${c}`}
                    x={15 + c * 19}
                    y={20 + r * 22}
                    width={16}
                    height={18}
                    rx={3}
                    fill={color}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 + v * 0.7 }}
                    transition={{ delay: (r + c) * 0.03 }}
                  />
                );
              })
            )}
          </g>
        );
      }
      case "crop": {
        // scatter + trend (deterministic)
        const dots = Array.from({ length: 18 }).map((_, i) => ({
          x: 20 + rand(i * 7.3) * 180,
          y: 30 + rand(i * 11.9) * 130,
        }));
        return (
          <g>
            <motion.line
              x1={20} y1={150} x2={200} y2={40}
              stroke={c1} strokeWidth={2.5} strokeDasharray="6 4"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }}
            />
            {dots.map((d, i) => (
              <motion.circle
                key={i} cx={d.x} cy={d.y} r={4} fill={i % 2 ? c2 : c3}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
              />
            ))}
          </g>
        );
      }
      case "spotify": {
        // radial / equalizer waves
        const bars = [40, 60, 80, 100, 80, 60, 40, 70, 95, 70, 50, 80];
        return (
          <g>
            {bars.map((h, i) => (
              <motion.rect
                key={i}
                x={15 + i * 16}
                width={10}
                rx={5}
                fill={i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3}
                initial={{ y: 95, height: 0 }}
                animate={{ y: [95 - h / 2, 95 - h, 95 - h / 2], height: [h / 2, h, h / 2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
              />
            ))}
          </g>
        );
      }
    }
  };

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-secondary to-background">
      <svg viewBox="0 0 220 190" className="h-full w-full">
        <defs>
          <linearGradient id={`g-${kind}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={c1} stopOpacity="0.15" />
            <stop offset="100%" stopColor={c2} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect width="220" height="190" fill={`url(#g-${kind})`} />
        {renderInner()}
      </svg>
    </div>
  );
}
