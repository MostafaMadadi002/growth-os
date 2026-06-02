import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JournalListScreen from '../screens/JournalListScreen';
import JournalDetailScreen from '../screens/JournalDetailScreen';
import JournalCreateScreen from '../screens/JournalCreateScreen';

const Stack = createNativeStackNavigator();

export default function JournalNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JournalList" component={JournalListScreen} />
      <Stack.Screen name="JournalDetail" component={JournalDetailScreen} />
      <Stack.Screen name="JournalCreate" component={JournalCreateScreen} />
    </Stack.Navigator>
  );
}
