import React, { useState, useRef, useEffect } from 'react';
import type { LineStyle, TimeRange } from '../../../shared/types';
import { Button } from '../../../shared/ui/Button/Button';
import { Select } from '../../../shared/ui/Select/Select';
import { Checkbox } from '../../../shared/ui/Checkbox/Checkbox';
import { 
  ExportIcon, 
  ZoomOutIcon, 
  ZoomInIcon, 
  ResetIcon, 
  SunIcon, 
  MoonIcon 
} from '../../../shared/ui/Icons';
import styles from './ChartControls.module.css';

interface ChartControlsProps {
  variations: string[];
  selectedVariations: string[];
  onToggleVariation: (variation: string) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  lineStyle: LineStyle;
  onLineStyleChange: (style: LineStyle) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onExport: () => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  variations,
  selectedVariations,
  onToggleVariation,
  timeRange,
  onTimeRangeChange,
  lineStyle,
  onLineStyleChange,
  isDarkTheme,
  onToggleTheme,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onExport,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.controlsContainer}>
      <div className={styles.group}>
        <div className={styles.dropdown} ref={dropdownRef}>
          <Button 
            className={styles.dropdownButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedVariations.length === variations.length
              ? 'All variations selected'
              : `${selectedVariations.length} variations selected`}
          </Button>
          {isDropdownOpen && (
            <div className={styles.dropdownContent}>
              {variations.map(variation => (
                <Checkbox
                  key={variation}
                  label={variation}
                  checked={selectedVariations.includes(variation)}
                  onChange={() => onToggleVariation(variation)}
                  disabled={selectedVariations.length === 1 && selectedVariations.includes(variation)}
                />
              ))}
            </div>
          )}
        </div>

        <Select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
          ]}
        />
      </div>

      <div className={styles.group}>
        <Select
          value={lineStyle}
          onChange={(e) => onLineStyleChange(e.target.value as LineStyle)}
          options={[
            { value: 'monotone', label: 'Line style: Smooth' },
            { value: 'linear', label: 'Line style: Line' },
            { value: 'area', label: 'Line style: Area' },
          ]}
        />

        <Button onClick={onExport} title="Export PNG" className={styles.iconButton}>
          <ExportIcon />
        </Button>

        <div className={styles.zoomGroup}>
          <Button onClick={onZoomOut} title="Zoom Out" className={styles.zoomButtonLeft}>
            <ZoomOutIcon />
          </Button>
          <div className={styles.divider} />
          <Button onClick={onZoomIn} title="Zoom In" className={styles.zoomButtonRight}>
            <ZoomInIcon />
          </Button>
        </div>
        
        <Button onClick={onResetZoom} title="Reset" className={styles.iconButton}>
          <ResetIcon />
        </Button>

        <Button onClick={onToggleTheme} title="Toggle Theme" className={styles.iconButton}>
          {isDarkTheme ? <SunIcon /> : <MoonIcon />}
        </Button>

      </div>
    </div>
  );
};
