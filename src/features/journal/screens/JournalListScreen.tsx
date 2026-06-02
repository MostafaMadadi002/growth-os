import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react-native';
import { journalService } from '../services/journalService';
import { JournalListItem } from '../components/JournalListItem';
import { useNavigation } from '@react-navigation/native';

export default function JournalListScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: entries, isLoading, refetch } = useQuery({
    queryKey: ['journals'],
    queryFn: journalService.getAllJournals,
  });

  const filteredEntries = entries?.filter(entry => 
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: any) => (
    <JournalListItem 
      entry={item} 
      onPress={() => navigation.navigate('JournalDetail', { id: item.id })} 
    />
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 pt-12">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-3xl font-bold text-slate-900 dark:text-white">ژورنال</Text>
      </View>

      <View className="relative mb-6">
        <View className="absolute left-4 top-4 z-10">
          <Search size={20} color="#94a3b8" />
        </View>
        <TextInput
          placeholder="جستجو در یادداشت‌ها..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-white"
        />
      </View>

      <FlatList
        data={filteredEntries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#10b981" />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-slate-500 dark:text-slate-400 text-lg">هنوز موردی ثبت نشده است.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('JournalCreate')}
        activeOpacity={0.8}
        className="absolute bottom-6 right-6 bg-emerald-500 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-emerald-500/50"
      >
        <Plus size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
