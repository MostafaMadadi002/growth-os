import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Edit3, ChevronRight } from 'lucide-react-native';
import { journalService } from '../services/journalService';
import { getJalaliDate } from '../../../core/utils/dateHelpers';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

export default function JournalDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { id } = route.params;
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { data: entry, isLoading } = useQuery({
    queryKey: ['journal', id],
    queryFn: async () => {
      const entries = await journalService.getAllJournals();
      return entries.find(e => e.id === id);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => journalService.deleteJournal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      setIsDeleteModalVisible(false);
      navigation.goBack();
    },
  });

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  if (isLoading || !entry) return null;

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <View className="pt-12 px-4 pb-4 flex-row items-center justify-between border-b border-slate-100 dark:border-slate-900">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <ChevronRight size={24} color="#64748b" />
        </TouchableOpacity>
        
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity onPress={() => {/* Edit functionality */}} className="p-2 mr-2">
            <Edit3 size={22} color="#10b981" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="p-2">
            <Trash2 size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-6">
        <Text className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">
          {getJalaliDate(new Date(entry.entry_date))}
        </Text>
        <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          {entry.title}
        </Text>
        <Text className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed text-right">
          {entry.content}
        </Text>
      </ScrollView>

      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onConfirm={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
      />
    </View>
  );
}
