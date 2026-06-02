import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react-native';
import { journalService } from '../services/journalService';
import { JournalForm } from '../components/JournalForm';

export default function JournalCreateScreen() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: journalService.createJournal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      navigation.goBack();
    },
  });

  const handleSubmit = (values: { title: string; content: string }) => {
    mutation.mutate({
      title: values.title,
      content: values.content,
      entry_date: new Date().toISOString(),
    });
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="pt-12 px-4 pb-4 flex-row items-center border-b border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
          <ChevronRight size={24} color="#64748b" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 dark:text-white">یادداشت جدید</Text>
      </View>

      <JournalForm onSubmit={handleSubmit} loading={mutation.isPending} />
    </View>
  );
}
