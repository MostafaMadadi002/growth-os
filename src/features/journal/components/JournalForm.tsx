import React, { useState } from 'react';
import { View, TextInput, ScrollView, Text } from 'react-native';
import { Button } from '../../../shared/ui/Button';
import { JournalEntry } from '../../../core/types';

interface Props {
  initialValues?: Partial<JournalEntry>;
  onSubmit: (values: { title: string; content: string }) => void;
  loading?: boolean;
}

export const JournalForm = ({ initialValues, onSubmit, loading }: Props) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');

  return (
    <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="space-y-4">
        <View>
          <Text className="text-slate-500 dark:text-slate-400 mb-2 font-medium">عنوان</Text>
          <TextInput
            placeholder="عنوان یادداشت..."
            placeholderTextColor="#94a3b8"
            value={title}
            onChangeText={setTitle}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white text-lg"
          />
        </View>

        <View>
          <Text className="text-slate-500 dark:text-slate-400 mb-2 font-medium">محتوا</Text>
          <TextInput
            placeholder="امروز چطور بود؟"
            placeholderTextColor="#94a3b8"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white text-base min-h-[300px]"
          />
        </View>

        <Button
          label="ذخیره ژورنال"
          onPress={() => onSubmit({ title, content })}
          loading={loading}
          disabled={!title || !content}
          className="mt-6"
        />
      </View>
    </ScrollView>
  );
};
