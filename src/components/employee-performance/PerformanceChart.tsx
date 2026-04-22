import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { type PerformanceDatum } from "./TopPerformerCard";

export default function PerformanceChart({
  data,
}: {
  data: PerformanceDatum[];
}) {
  //   const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ width: 260, height: 260 }} className="shrink-0">
      <ResponsiveContainer width={260} height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            paddingAngle={2}
            label={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `$${value}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
