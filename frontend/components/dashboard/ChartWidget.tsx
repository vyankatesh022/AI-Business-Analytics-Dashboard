import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import dynamic from 'next/dynamic';
import { ChartType } from '@/store/useVisualizationStore';
import DOMPurify from 'dompurify';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface ChartWidgetProps {
  title: string;
  type: ChartType;
  data: any[];
  xAxis?: string;
  yAxis?: string | string[];
  isLoading?: boolean;
}

export default function ChartWidget({ title, type, data, xAxis, yAxis, isLoading }: ChartWidgetProps) {
  // Sanitize data labels to prevent XSS
  const sanitizedData = useMemo(() => {
    if (!data) return [];
    return data.map(item => {
      const newItem = { ...item };
      if (xAxis && typeof newItem[xAxis] === 'string') {
        newItem[xAxis] = DOMPurify.sanitize(newItem[xAxis]);
      }
      return newItem;
    });
  }, [data, xAxis]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white border border-slate-200 rounded-xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500">
        No data available for this chart.
      </div>
    );
  }

  const yCols = Array.isArray(yAxis) ? yAxis : (yAxis ? [yAxis] : []);

  const renderRecharts = () => {
    if (type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sanitizedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xAxis || ''} />
            <YAxis />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Legend />
            {yCols.map((y, idx) => (
              <Bar key={y} dataKey={y} fill={COLORS[idx % COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    if (type === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sanitizedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xAxis || ''} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yCols.map((y, idx) => (
              <Line key={y} type="monotone" dataKey={y} stroke={COLORS[idx % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'pie') {
      const dataKey = yCols[0] || 'value';
      const nameKey = xAxis || 'name';
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={sanitizedData}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {sanitizedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );
    }
    return null;
  };

  const renderPlotly = () => {
    if (type === 'scatter') {
      const yCol = yCols[0];
      return (
        <Plot
          data={[
            {
              x: sanitizedData.map(d => d[xAxis || '']),
              y: sanitizedData.map(d => d[yCol || '']),
              type: 'scatter',
              mode: 'markers',
              marker: { color: COLORS[0], size: 8 }
            }
          ]}
          layout={{ 
            autosize: true, 
            margin: { l: 40, r: 20, t: 20, b: 40 },
            xaxis: { title: xAxis },
            yaxis: { title: yCol }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true, displayModeBar: false }}
        />
      );
    }
    if (type === 'histogram') {
      return (
        <Plot
          data={[
            {
              x: sanitizedData.map(d => d.bin_label),
              y: sanitizedData.map(d => d.count),
              type: 'bar',
              marker: { color: COLORS[1] }
            }
          ]}
          layout={{ 
            autosize: true, 
            margin: { l: 40, r: 20, t: 20, b: 40 },
            xaxis: { title: xAxis },
            yaxis: { title: 'Count' }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true, displayModeBar: false }}
        />
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
        <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
      </div>
      <div className="flex-1 p-2 min-h-0 relative">
         {type === 'scatter' || type === 'histogram' ? renderPlotly() : renderRecharts()}
      </div>
    </div>
  );
}
