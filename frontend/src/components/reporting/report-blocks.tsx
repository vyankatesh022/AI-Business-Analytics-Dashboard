"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Type, Table, PieChart, Activity, GripVertical } from "lucide-react"

export const BLOCK_TYPES = [
  { id: "kpi", name: "KPI Card", icon: Activity, desc: "Single metric display" },
  { id: "chart_bar", name: "Bar Chart", icon: BarChart, desc: "Categorical comparison" },
  { id: "chart_pie", name: "Pie Chart", icon: PieChart, desc: "Proportional data" },
  { id: "table", name: "Data Table", icon: Table, desc: "Detailed tabular data" },
  { id: "text", name: "Text Block", icon: Type, desc: "Rich text description" },
]

export function ReportBlocksPalette() {
  return (
    <div className="space-y-3">
      {BLOCK_TYPES.map((block) => (
        <Card 
          key={block.id}
          className="p-3 flex items-center cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("application/reactflow", block.id)
            e.dataTransfer.effectAllowed = "move"
          }}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground mr-2" />
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 mr-3">
            <block.icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium leading-none">{block.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{block.desc}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
