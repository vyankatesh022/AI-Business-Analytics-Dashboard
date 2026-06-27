"use client";

import { motion } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

interface KPICardProps {
  title: string;
  value: string | number;
  trend: number;
  previousValue?: string | number;
  sparklineData?: { value: number }[];
  format?: "currency" | "number" | "percentage";
  prefix?: string;
  suffix?: string;
}

export function KPICard({
  title,
  value,
  trend,
  previousValue,
  sparklineData,
  format = "number",
  prefix = "",
  suffix = "",
}: KPICardProps) {
  const isPositive = trend > 0;
  const isNeutral = trend === 0;
  const isNegative = trend < 0;

  const formattedValue =
    format === "currency"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(Number(value))
      : format === "percentage"
      ? `${value}%`
      : new Intl.NumberFormat("en-US").format(Number(value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div
            className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-500"
                : isNegative
                ? "bg-rose-500/10 text-rose-500"
                : "bg-zinc-500/10 text-zinc-500"
            }`}
          >
            {isPositive ? (
              <ArrowUpIcon className="h-3 w-3" />
            ) : isNegative ? (
              <ArrowDownIcon className="h-3 w-3" />
            ) : (
              <MinusIcon className="h-3 w-3" />
            )}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1">
            <span className="text-3xl font-bold tracking-tight">
              {prefix}
              {formattedValue}
              {suffix}
            </span>
            {previousValue && (
              <span className="text-xs text-muted-foreground">
                vs. {prefix}
                {previousValue}
                {suffix} last period
              </span>
            )}
          </div>
          
          {sparklineData && sparklineData.length > 0 && (
            <div className="h-[60px] mt-4 w-full opacity-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Value
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0].value}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={
                      isPositive
                        ? "#10b981"
                        : isNegative
                        ? "#f43f5e"
                        : "#71717a"
                    }
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
