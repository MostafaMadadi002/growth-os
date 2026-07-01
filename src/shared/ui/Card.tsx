import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  className?: string;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <View 
      className={`bg-surface-card backdrop-blur-xl p-4 rounded-3xl border border-surface-border shadow-sm ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
