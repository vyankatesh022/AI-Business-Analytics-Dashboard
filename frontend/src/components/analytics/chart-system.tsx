"use client";

import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Funnel,
  FunnelChart as RechartsFunnelChart,
  LabelList,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ChartProps {
  title: string;
  description?: string;
  data: any[];
  xKey: string;
  series: { key: string; name: string; color: string }[];
  type?: "line" | "area" | "bar";
  height?: number;
  yAxisFormatter?: (value: number) => string;
}

export function TrendChart({
  title,
  description,
  data,
  xKey,
  series,
  type = "line",
  height = 350,
  yAxisFormatter = (val) => val.toString(),
}: ChartProps) {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#a1a1aa" : "#71717a";
  const gridColor = theme === "dark" ? "#27272a" : "#e4e4e7";

  return (
    <Card className="col-span-4 border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height: height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === "line" ? (
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey={xKey} stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} />
                <Tooltip
                  contentStyle={{ backgroundColor: theme === "dark" ? "#18181b" : "#fff", borderRadius: "8px", border: "1px solid #27272a" }}
                  itemStyle={{ color: textColor }}
                />
                <Legend />
                {series.map((s) => (
                  <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                ))}
              </LineChart>
            ) : type === "area" ? (
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  {series.map((s) => (
                    <linearGradient key={`color-${s.key}`} id={`color-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey={xKey} stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} />
                <Tooltip
                  contentStyle={{ backgroundColor: theme === "dark" ? "#18181b" : "#fff", borderRadius: "8px", border: "1px solid #27272a" }}
                />
                <Legend />
                {series.map((s) => (
                  <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} fillOpacity={1} fill={`url(#color-${s.key})`} />
                ))}
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey={xKey} stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} />
                <Tooltip
                  contentStyle={{ backgroundColor: theme === "dark" ? "#18181b" : "#fff", borderRadius: "8px", border: "1px solid #27272a" }}
                />
                <Legend />
                {series.map((s) => (
                  <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface FunnelChartProps {
  title: string;
  description?: string;
  data: { step_name: string; users: number; conversion_rate: number }[];
  height?: number;
}

export function AnalyticsFunnelChart({ title, description, data, height = 350 }: FunnelChartProps) {
  const { theme } = useTheme();
  const colors = ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e"];

  // Recharts funnel needs value prop
  const formattedData = data.map((d, i) => ({
    name: d.step_name,
    value: d.users,
    fill: colors[i % colors.length],
    conversion_rate: d.conversion_rate,
  }));

  return (
    <Card className="col-span-2 border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsFunnelChart>
              <Tooltip
                contentStyle={{ backgroundColor: theme === "dark" ? "#18181b" : "#fff", borderRadius: "8px", border: "1px solid #27272a" }}
              />
              <Funnel dataKey="value" data={formattedData} isAnimationActive>
                <LabelList position="right" fill="#888" stroke="none" dataKey="name" />
              </Funnel>
            </RechartsFunnelChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface CohortCell {
  cohort_date: string;
  period: int;
  users: number;
  retention_rate: number;
}

interface CohortHeatmapProps {
  title: string;
  description?: string;
  data: CohortCell[];
}

export function CohortHeatmap({ title, description, data }: CohortHeatmapProps) {
  // Group data by cohort_date
  const cohorts = data.reduce((acc, curr) => {
    if (!acc[curr.cohort_date]) {
      acc[curr.cohort_date] = [];
    }
    acc[curr.cohort_date].push(curr);
    return acc;
  }, {} as Record<string, CohortCell[]>);

  const cohortDates = Object.keys(cohorts).sort();
  const maxPeriods = Math.max(...data.map((d) => d.period));

  const getIntensityColor = (rate: number) => {
    // 0-100 mapped to indigo alphas
    if (rate >= 90) return "bg-indigo-600 text-white";
    if (rate >= 70) return "bg-indigo-500 text-white";
    if (rate >= 50) return "bg-indigo-400 text-white";
    if (rate >= 30) return "bg-indigo-300 text-indigo-900";
    if (rate >= 10) return "bg-indigo-200 text-indigo-900";
    if (rate > 0) return "bg-indigo-100 text-indigo-900";
    return "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground";
  };

  return (
    <Card className="col-span-4 border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-muted-foreground bg-muted/50">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Cohort</th>
                <th className="px-4 py-3">Users</th>
                {Array.from({ length: maxPeriods + 1 }).map((_, i) => (
                  <th key={i} className="px-4 py-3 text-center">Month {i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortDates.map((date) => {
                const cells = cohorts[date];
                const baseUsers = cells.find((c) => c.period === 0)?.users || 0;
                
                return (
                  <tr key={date} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3 font-medium">{date}</td>
                    <td className="px-4 py-3">{baseUsers}</td>
                    {Array.from({ length: maxPeriods + 1 }).map((_, i) => {
                      const cell = cells.find((c) => c.period === i);
                      return (
                        <td key={i} className="p-1">
                          {cell ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: i * 0.05 }}
                              className={`w-full h-10 flex items-center justify-center rounded-md font-medium text-xs ${getIntensityColor(cell.retention_rate)}`}
                              title={`${cell.retention_rate}% retention`}
                            >
                              {cell.retention_rate.toFixed(1)}%
                            </motion.div>
                          ) : (
                            <div className="w-full h-10 bg-muted/20 rounded-md"></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
