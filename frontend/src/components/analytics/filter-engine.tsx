"use client";

import * as React from "react";
import { Filter, Calendar, Users, Briefcase, MapPin } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface FilterEngineProps {
  onFilterChange: (filters: any) => void;
}

export function FilterEngine({ onFilterChange }: FilterEngineProps) {
  const [dateRange, setDateRange] = React.useState("30d");
  const [segment, setSegment] = React.useState("all");

  const handleDateChange = (val: string) => {
    setDateRange(val);
    onFilterChange({ dateRange: val, segment });
  };

  const handleSegmentChange = (val: string) => {
    setSegment(val);
    onFilterChange({ dateRange, segment: val });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 bg-card p-2 rounded-lg border border-border shadow-sm"
    >
      <div className="flex items-center space-x-2 px-2 text-sm font-medium text-muted-foreground border-r pr-4 border-border">
        <Filter className="h-4 w-4 mr-2" />
        Global Filters
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 border-dashed border")}>
          <Calendar className="mr-2 h-4 w-4" />
          {dateRange === "7d" ? "Last 7 Days" : dateRange === "30d" ? "Last 30 Days" : "Last 90 Days"}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuRadioGroup value={dateRange} onValueChange={handleDateChange}>
            <DropdownMenuLabel>Date Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioItem value="7d">Last 7 Days</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="30d">Last 30 Days</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="90d">Last 90 Days</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 border-dashed border")}>
          <Users className="mr-2 h-4 w-4" />
          {segment === "all" ? "All Users" : segment === "active" ? "Active Users" : "Enterprise Users"}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuRadioGroup value={segment} onValueChange={handleSegmentChange}>
            <DropdownMenuLabel>User Segment</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioItem value="all">All Users</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="active">Active Users</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="enterprise">Enterprise Users</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button variant="ghost" size="sm" className="h-8 border-dashed border text-muted-foreground opacity-50 cursor-not-allowed">
        <Briefcase className="mr-2 h-4 w-4" />
        Product (Pro)
      </Button>
      
      <Button variant="ghost" size="sm" className="h-8 border-dashed border text-muted-foreground opacity-50 cursor-not-allowed">
        <MapPin className="mr-2 h-4 w-4" />
        Region (Pro)
      </Button>

    </motion.div>
  );
}
