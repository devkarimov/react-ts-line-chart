import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', ...props }) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]} ${className || ''}`} 
      {...props} 
    />
  );
};
