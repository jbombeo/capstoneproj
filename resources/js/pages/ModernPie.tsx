import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

interface PieData {
  name: string;
  value: number;
}

interface AmazingPieProps {
  title: string;
  data: PieData[];
}

const COLORS = [
  "url(#gradBlue)",
  "url(#gradPurple)",
  "url(#gradGreen)",
  "url(#gradOrange)",
  "url(#gradRed)",
];

export default function AmazingPie({ title, data }: AmazingPieProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full h-[380px] relative">

      {/* Title */}
      <h2 className="text-center text-xl font-bold text-gray-800 mb-3 tracking-tight">
        {title}
      </h2>

      {/* Pie container */}
      <div className="w-full h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, bottom: 0 }}>
            <defs>
              {/* GRADIENT COLORS */}
              <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="gradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="1" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" stopOpacity="1" />
                <stop offset="100%" stopColor="#15803D" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="gradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" stopOpacity="1" />
                <stop offset="100%" stopColor="#C2410C" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="gradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="1" />
                <stop offset="100%" stopColor="#B91C1C" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={activeIndex === null ? 90 : 100}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={12}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              animationDuration={500}
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  style={{
                    filter:
                      activeIndex === i
                        ? "drop-shadow(0px 0px 8px rgba(0,0,0,0.35))"
                        : "drop-shadow(0px 0px 5px rgba(0,0,0,0.15))",
                    transition: "0.3s",
                  }}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                background: "#fff",
                border: "none",
                padding: "10px 14px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total */}
        <div
          className="
            absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            text-center z-10
          "
        >
          <div
            className="
              w-20 h-20 bg-white shadow-lg 
              rounded-full flex flex-col items-center justify-center
              border border-gray-200
            "
          >
            <span className="text-2xl font-bold text-gray-800">{total}</span>
            <span className="text-[10px] text-gray-500">Total</span>
          </div>
        </div>
      </div>

      {/* LEGEND BELOW PIE — CLEAN & MODERN */}
      <div className="flex justify-center gap-6 mt-4 flex-wrap">
        {data.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: `var(--color-${i})`, backgroundImage: COLORS[i % COLORS.length] }}
            />
            <span className="font-medium">{entry.name}: </span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
