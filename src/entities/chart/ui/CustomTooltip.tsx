import { format, parseISO } from 'date-fns';
import { CalendarIcon, TrophyIcon } from '../../../shared/ui/Icons';
import styles from './CustomTooltip.module.css';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    [key: string]: unknown;
  }>;
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length || !label) return null;

  const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
  const formattedDate = format(parseISO(label), 'dd/MM/yyyy');

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipHeader}>
        <CalendarIcon className={styles.calendarIcon} />
        <span>{formattedDate}</span>
      </div>
      
      <div className={styles.tooltipDivider} />
      
      <div className={styles.tooltipList}>
        {sortedPayload.map((entry, index) => (
          <div key={entry.name} className={styles.tooltipItem}>
            <div className={styles.tooltipItemLeft}>
              <span 
                className={styles.tooltipDot} 
                style={{ backgroundColor: entry.color }} 
              />
              <span className={styles.tooltipName}>{entry.name}</span>
              {index === 0 && (
                <TrophyIcon className={styles.trophyIcon} />
              )}
            </div>
            <span className={styles.tooltipValue}>{entry.value?.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
