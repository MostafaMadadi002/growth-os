import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button = ({ 
  label, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  className = '' 
}: ButtonProps) => {
  const baseStyle = "px-6 py-4 rounded-2xl flex-row items-center justify-center ";
  
  const variants = {
    primary: "bg-emerald-500",
    secondary: "bg-slate-700",
    outline: "border-2 border-emerald-500",
    destructive: "bg-red-500",
  };

  const textStyles = {
    primary: "text-white font-bold",
    secondary: "text-white font-bold",
    outline: "text-emerald-500 font-bold",
    destructive: "text-white font-bold",
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`${textStyles[variant]} text-base`}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};
