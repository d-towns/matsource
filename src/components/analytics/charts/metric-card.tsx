'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatNumber } from '@/lib/analytics/utils';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  description?: string;
  format: 'number' | 'percentage' | 'currency' | 'duration';
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MetricCard({
  title,
  value,
  subtitle,
  description,
  format,
  change,
  changeType,
  trend,
  icon: Icon,
  color = '#3b82f6',
  size = 'md'
}: MetricCardProps) {
  
  // Format the main value
  const formattedValue = typeof value === 'number' 
    ? formatNumber(value, format) 
    : value;

  // Determine trend styling
  const getTrendStyling = () => {
    if (!trend || change === undefined) return null;

    const isPositive = trend === 'up';
    const isNegative = trend === 'down';
    const isNeutral = trend === 'stable';

    // For some metrics, "up" might be bad (like cancellation rate)
    // This can be customized based on changeType prop
    let colorClass = '';
    let TrendIcon = Minus;

    if (changeType === 'increase') {
      colorClass = isPositive ? 'text-green-600 bg-green-50' : isNegative ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50';
      TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
    } else if (changeType === 'decrease') {
      colorClass = isNegative ? 'text-green-600 bg-green-50' : isPositive ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50';
      TrendIcon = isNegative ? TrendingDown : isPositive ? TrendingUp : Minus;
    } else {
      colorClass = isPositive ? 'text-blue-600 bg-blue-50' : isNegative ? 'text-orange-600 bg-orange-50' : 'text-gray-600 bg-gray-50';
      TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
    }

    return {
      colorClass,
      TrendIcon
    };
  };

  const trendStyling = getTrendStyling();

  // Size variants
  const sizeClasses = {
    sm: {
      value: 'text-xl',
      title: 'text-sm',
      subtitle: 'text-xs',
      icon: 'h-4 w-4',
      padding: 'p-4'
    },
    md: {
      value: 'text-2xl',
      title: 'text-base',
      subtitle: 'text-sm',
      icon: 'h-5 w-5',
      padding: 'p-6'
    },
    lg: {
      value: 'text-3xl',
      title: 'text-lg',
      subtitle: 'text-base',
      icon: 'h-6 w-6',
      padding: 'p-8'
    }
  };

  const classes = sizeClasses[size];

  return (
    <Card className="font-sans">
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${classes.padding}`}>
        <div className="flex-1">
          <CardTitle className={`${classes.title} font-medium font-sans`}>
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="font-sans mt-1">
              {description}
            </CardDescription>
          )}
        </div>
        {Icon && (
          <div 
            className={`${classes.icon} opacity-60`}
            style={{ color }}
          >
            <Icon className={classes.icon} />
          </div>
        )}
      </CardHeader>
      
      <CardContent className={`${classes.padding} pt-0`}>
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <div className={`${classes.value} font-bold font-sans`}>
              {formattedValue}
            </div>
            {subtitle && (
              <p className={`${classes.subtitle} text-muted-foreground font-sans mt-1`}>
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Trend indicator */}
          {trendStyling && change !== undefined && (
            <Badge 
              variant="secondary" 
              className={`${trendStyling.colorClass} border-0 font-sans`}
            >
              <trendStyling.TrendIcon className="h-3 w-3 mr-1" />
              {Math.abs(change).toFixed(1)}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 