'use client'

import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartDataPoint } from '@/lib/analytics/types';
import { formatDate, formatNumber } from '@/lib/analytics/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TimeSeriesChartProps {
  data: ChartDataPoint[];
  title: string;
  description?: string;
  type: 'line' | 'bar' | 'area';
  color?: string;
  groupBy?: 'day' | 'week' | 'month';
  trend?: 'up' | 'down' | 'stable';
  changePercent?: number;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
}

export function TimeSeriesChart({
  data,
  title,
  description,
  type = 'line',
  color = '#3b82f6',
  groupBy = 'day',
  trend,
  changePercent,
  height = 300,
  showGrid = true,
  showTooltip = true
}: TimeSeriesChartProps) {
  
  // Format data for Recharts
  const chartData = data.map(point => ({
    ...point,
    formattedDate: formatDate(point.date, groupBy),
    displayValue: point.value
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium font-sans">{label}</p>
          <p className="text-sm font-sans">
            <span className="font-medium" style={{ color: payload[0].color }}>
              {title}: {formatNumber(payload[0].value, 'number')}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Trend indicator
  const TrendIndicator = () => {
    if (!trend || changePercent === undefined) return null;

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';

    return (
      <div className={`flex items-center gap-1 text-sm font-sans ${trendColor}`}>
        <TrendIcon className="h-4 w-4" />
        <span>{Math.abs(changePercent).toFixed(1)}%</span>
      </div>
    );
  };

  // Render appropriate chart type
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const xAxisProps = {
      dataKey: 'formattedDate',
      stroke: '#888888',
      fontSize: 12,
      tickLine: false,
      axisLine: false
    };

    const yAxisProps = {
      stroke: '#888888',
      fontSize: 12,
      tickLine: false,
      axisLine: false,
      tickFormatter: (value: number) => formatNumber(value, 'number')
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            <Line 
              type="monotone" 
              dataKey="displayValue" 
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            <Bar 
              dataKey="displayValue" 
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            <Area 
              type="monotone" 
              dataKey="displayValue" 
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={0.1}
            />
          </AreaChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="font-sans">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-sans">{title}</CardTitle>
            {description && (
              <CardDescription className="font-sans">{description}</CardDescription>
            )}
          </div>
          <TrendIndicator />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 