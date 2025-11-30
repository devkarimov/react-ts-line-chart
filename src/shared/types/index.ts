export interface Variation {
  id?: number;
  name: string;
}

export interface DailyStats {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

export interface ApiData {
  variations: Variation[];
  data: DailyStats[];
}

export interface ProcessedDataPoint {
  date: string;
  [key: string]: number | string;
}

export type LineStyle = 'monotone' | 'linear' | 'area';
export type TimeRange = 'day' | 'week';
