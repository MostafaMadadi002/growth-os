import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import BottomTabsNavigator from './src/core/navigation/BottomTabsNavigator';

const queryClient = QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar style="light" />
        <BottomTabsNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
