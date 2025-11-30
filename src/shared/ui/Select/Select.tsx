import React from 'react';
import styles from './Select.module.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ className, options, ...props }) => {
  return (
    <select className={`${styles.select} ${className || ''}`} {...props}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
