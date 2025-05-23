'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBreakdown } from '@/lib/analytics/types';
import { formatNumber } from '@/lib/analytics/utils';

interface StatusBreakdownChartProps {
  data: StatusBreakdown[];
  title: string;
  description?: string;
  type?: 'pie' | 'donut';
  height?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  showTooltip?: boolean;
}

export function StatusBreakdownChart({
  data,
  title,
  description,
  type = 'donut',
  height = 300,
  showLegend = true,
  showLabels = true,
  showTooltip = true
}: StatusBreakdownChartProps) {
  
  // Format data for Recharts
  const chartData = data.map(item => ({
    name: item.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: item.count,
    percentage: item.percentage,
    color: item.color || '#8884d8',
    originalStatus: item.status
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; percentage: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium font-sans">{data.name}</p>
          <p className="text-sm font-sans">
            Count: <span className="font-medium">{formatNumber(data.value, 'number')}</span>
          </p>
          <p className="text-sm font-sans">
            Percentage: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function
  const renderLabel = (entry: { percentage: number }) => {
    if (!showLabels || entry.percentage < 5) return ''; // Hide labels for small slices
    return `${entry.percentage.toFixed(0)}%`;
  };

  // Custom legend component
  const CustomLegend = () => {
    if (!showLegend) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-sans">{entry.name}</span>
            <Badge variant="secondary" className="text-xs font-sans">
              {formatNumber(entry.value, 'number')}
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  // Summary stats
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const topStatus = data.reduce((max, item) => 
    item.count > max.count ? item : max, 
    data[0] || { status: 'none', count: 0, percentage: 0 }
  );

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
          <div className="text-right">
            <div className="text-2xl font-bold font-sans">
              {formatNumber(totalCount, 'number')}
            </div>
            <div className="text-sm text-muted-foreground font-sans">
              Total
            </div>
          </div>
        </div>
        
        {/* Top status indicator */}
        {topStatus.count > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground font-sans">Most common:</span>
            <Badge 
              variant="secondary" 
              className="font-sans"
              style={{ backgroundColor: topStatus.color + '20', color: topStatus.color }}
            >
              {topStatus.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
              ({topStatus.percentage.toFixed(1)}%)
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={type === 'donut' ? 80 : 100}
              innerRadius={type === 'donut' ? 40 : 0}
              fill="#8884d8"
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
          </PieChart>
        </ResponsiveContainer>
        
        <CustomLegend />
      </CardContent>
    </Card>
  );
} 