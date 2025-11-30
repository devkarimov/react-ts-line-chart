import { useState, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import type { ApiData, ProcessedDataPoint, LineStyle, TimeRange } from '../../../shared/types';
import rawData from '../../../shared/api/data.json';
import { aggregateData } from '../lib/aggregateData';

const COLORS = ['#FF7F50', '#4169E1', '#32CD32', '#FFD700', '#8A2BE2'];

const VARIATION_COLORS: Record<string, string> = {
  'Original': '#333333',
  'Variation A': '#4169E1',
  'Variation B': '#FF7F50',
  'Variation C': '#FFD700',
};

export const useChartDashboard = () => {
  const apiData = rawData as unknown as ApiData;

  const variationMap = useMemo(() => new Map(
    apiData.variations.map(v => [v.id?.toString() ?? '0', v.name])
  ), [apiData.variations]);

  const allVariations = useMemo(() => Array.from(variationMap.values()), [variationMap]);

  const [selectedVariations, setSelectedVariations] = useState<string[]>(() => Array.from(variationMap.values()));
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [lineStyle, setLineStyle] = useState<LineStyle>('monotone');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [chartKey, setChartKey] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);

  const variationColors = useMemo(() => 
    allVariations.reduce((acc, v, i) => ({
      ...acc,
      [v]: VARIATION_COLORS[v] || COLORS[i % COLORS.length]
    }), {} as Record<string, string>), 
  [allVariations]);

  const processedData = useMemo(() => {
    const aggregated = aggregateData(apiData.data, timeRange, variationMap);

    const fullData = Object.entries(aggregated)
      .map(([date, variations]) => {
        const point: ProcessedDataPoint = { date };
        let hasData = false;

        selectedVariations.forEach(v => {
          const stats = variations[v];
          if (stats?.visits) {
            point[v] = (stats.conversions / stats.visits) * 100;
            hasData = true;
          }
        });

        return hasData ? point : null;
      })
      .filter((p): p is ProcessedDataPoint => Boolean(p))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (zoomLevel === 0) return fullData;
    
    const totalPoints = fullData.length;
    const pointsToShow = Math.max(5, Math.floor(totalPoints * (1 - zoomLevel * 0.2)));
    const startIndex = Math.floor((totalPoints - pointsToShow) / 2);
    
    return fullData.slice(startIndex, startIndex + pointsToShow);
  }, [apiData.data, timeRange, selectedVariations, variationMap, zoomLevel]);

  const handleToggleVariation = (variation: string) => {
    setSelectedVariations(prev => {
      if (prev.includes(variation) && prev.length === 1) return prev;
      return prev.includes(variation) 
        ? prev.filter(v => v !== variation)
        : [...prev, variation];
    });
  };

  const toggleTheme = () => {
    setIsDarkTheme(prev => {
      const next = !prev;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 0));

  const resetZoom = () => {
    setZoomLevel(0);
    setChartKey(prev => prev + 1);
  };

  const handleExport = async () => {
    if (!chartRef.current) return;
    
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = 'chart.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return {
    allVariations,
    selectedVariations,
    timeRange,
    lineStyle,
    isDarkTheme,
    chartKey,
    chartRef,
    processedData,
    variationColors,
    setTimeRange,
    setLineStyle,
    handleToggleVariation,
    toggleTheme,
    handleZoomIn,
    handleZoomOut,
    resetZoom,
    handleExport,
  };
};
