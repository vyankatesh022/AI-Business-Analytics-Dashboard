import React from 'react';
import { motion } from 'framer-motion';
import { Activity, DollarSign, Database, TrendingUp } from 'lucide-react';

interface KPIWidgetProps {
  title: string;
  value: string | number;
  metric: 'total_records' | 'total_revenue' | 'average_sales';
  isLoading?: boolean;
}

export default function KPIWidget({ title, value, metric, isLoading }: KPIWidgetProps) {
  const getIcon = () => {
    switch (metric) {
      case 'total_records': return <Database className="w-5 h-5 text-blue-500" />;
      case 'total_revenue': return <DollarSign className="w-5 h-5 text-emerald-500" />;
      case 'average_sales': return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default: return <Activity className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (metric === 'total_revenue' || metric === 'average_sales') {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
      }
      return new Intl.NumberFormat('en-US').format(val);
    }
    return val;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="w-full h-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 text-slate-500 mb-2">
        {getIcon()}
        <h4 className="text-sm font-semibold uppercase tracking-wider">{title}</h4>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse flex space-x-4 h-8">
           <div className="flex-1 bg-slate-200 rounded"></div>
        </div>
      ) : (
        <div className="text-3xl font-bold text-slate-900 font-mono mt-auto">
          {formatValue(value)}
        </div>
      )}
    </motion.div>
  );
}
