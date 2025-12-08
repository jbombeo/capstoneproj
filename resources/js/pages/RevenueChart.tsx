import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
} from "recharts";

interface RevenueChartProps {
  data: {
    date: string;
    total: number;
    transactions: number;
  }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="w-full h-96 p-4 bg-white rounded-2xl shadow-md border">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Daily Revenue Overview
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              padding: "10px 14px",
            }}
            labelStyle={{ color: "#111827", fontWeight: "600" }}
            formatter={(value: any, name: string) => {
              if (name === "total") {
                return [`₱${Number(value).toLocaleString()}`, "Total Revenue"];
              }
              if (name === "transactions") {
                return [`${value}`, "Transactions"];
              }
              return [value, name];
            }}
          />

          <defs>
            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <Area
            yAxisId="left"
            type="monotone"
            dataKey="total"
            stroke="#2563eb"
            strokeWidth={3}
            fill="url(#revGradient)"
            name="Revenue"
          />

          <Bar
            yAxisId="right"
            dataKey="transactions"
            fill="#10b981"
            barSize={26}
            radius={[6, 6, 0, 0]}
            name="Transactions"
          />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
