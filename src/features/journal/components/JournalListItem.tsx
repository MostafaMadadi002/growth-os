import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../../../shared/ui/Card';
import { JournalEntry } from '../../../core/types';
import { getJalaliDate } from '../../../core/utils/dateHelpers';
import { ChevronLeft } from 'lucide-react-native';

interface Props {
  entry: JournalEntry;
  onPress: () => void;
}

export const JournalListItem = ({ entry, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="mb-4">
      <Card className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1" numberOfLines={1}>
            {entry.title || 'بدون عنوان'}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            {getJalaliDate(new Date(entry.entry_date))}
          </Text>
          <Text className="text-sm text-slate-600 dark:text-slate-300" numberOfLines={2}>
            {entry.content}
          </Text>
        </View>
        <ChevronLeft size={20} color="#64748b" />
      </Card>
    </TouchableOpacity>
  );
};
