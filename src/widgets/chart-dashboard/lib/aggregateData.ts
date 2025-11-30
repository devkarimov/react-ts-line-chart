import { format, startOfWeek, parseISO } from 'date-fns';
import type { ApiData, TimeRange } from '../../../shared/types';

export const aggregateData = (
  data: ApiData['data'],
  timeRange: TimeRange,
  variationMap: Map<string, string>
) => {
  return data.reduce((acc, dayStat) => {
    const dateKey = timeRange === 'week'
      ? format(startOfWeek(parseISO(dayStat.date)), 'yyyy-MM-dd')
      : dayStat.date;

    if (!acc[dateKey]) acc[dateKey] = {};

    Object.entries(dayStat.visits).forEach(([id, visits]) => {
      const name = variationMap.get(id);
      if (!name) return;

      if (!acc[dateKey][name]) {
        acc[dateKey][name] = { visits: 0, conversions: 0 };
      }
      
      acc[dateKey][name].visits += visits;
      acc[dateKey][name].conversions += dayStat.conversions[id] || 0;
    });

    return acc;
  }, {} as Record<string, Record<string, { visits: number; conversions: number }>>);
};
