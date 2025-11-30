import React from 'react';
import {
  LineChart as RechartsLineChart,
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import type { ProcessedDataPoint, LineStyle } from '../../../shared/types';
import { CustomTooltip } from './CustomTooltip';
import styles from './LineChart.module.css';

interface LineChartProps {
  data: ProcessedDataPoint[];
  variations: string[];
  lineStyle: LineStyle;
  colors: Record<string, string>;
}

export const LineChart: React.FC<LineChartProps> = ({ data, variations, lineStyle, colors }) => {
  const isArea = lineStyle === 'area';
  const ChartComponent = isArea ? AreaChart : RechartsLineChart;

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="var(--grid-color)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--text-secondary)"
            tick={{ fill: 'var(--text-secondary)' }}
            tickFormatter={(value) => format(parseISO(value), 'd MMM')}
          />
          <YAxis 
            tickFormatter={(value) => `${value}%`} 
            stroke="var(--text-secondary)"
            tick={{ fill: 'var(--text-secondary)' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--text-secondary)', strokeWidth: 1 }} />
          {variations.map((variation) => (
            isArea ? (
              <Area
                key={variation}
                type="monotone"
                dataKey={variation}
                stroke={colors[variation]}
                fill={colors[variation]}
                fillOpacity={0.3}
                strokeWidth={2}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ) : (
              <Line
                key={variation}
                type={lineStyle as 'monotone' | 'linear'}
                dataKey={variation}
                stroke={colors[variation]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls
              />
            )
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};
