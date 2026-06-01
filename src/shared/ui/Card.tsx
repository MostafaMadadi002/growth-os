import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  className?: string;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <View 
      className={`bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
