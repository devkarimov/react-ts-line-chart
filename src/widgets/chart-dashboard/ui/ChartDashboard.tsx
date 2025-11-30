import React from 'react';
import { ChartControls } from '../../../features/chart-controls/ui/ChartControls';
import { LineChart } from '../../../entities/chart/ui/LineChart';
import { useChartDashboard } from '../model/useChartDashboard';
import styles from './ChartDashboard.module.css';

export const ChartDashboard: React.FC = () => {
  const {
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
  } = useChartDashboard();

  return (
    <div ref={chartRef} className={`${styles.container} ${isDarkTheme ? styles.dark : styles.light}`}>
      <ChartControls
        variations={allVariations}
        selectedVariations={selectedVariations}
        onToggleVariation={handleToggleVariation}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        lineStyle={lineStyle}
        onLineStyleChange={setLineStyle}
        isDarkTheme={isDarkTheme}
        onToggleTheme={toggleTheme}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={resetZoom}
        onExport={handleExport}
      />
      <LineChart
        key={chartKey}
        data={processedData}
        variations={selectedVariations}
        lineStyle={lineStyle}
        colors={variationColors}
      />
    </div>
  );
};
