import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Button } from '../../../shared/ui/Button';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteConfirmationModal = ({ visible, onCancel, onConfirm, loading }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50 p-6">
        <View className="bg-white dark:bg-slate-900 w-full p-6 rounded-3xl">
          <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            حذف یادداشت
          </Text>
          <Text className="text-slate-600 dark:text-slate-400 mb-8 text-center text-lg">
            آیا از حذف این یادداشت اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </Text>
          
          <View className="flex-row space-x-4">
            <Button
              label="حذف"
              onPress={onConfirm}
              variant="destructive"
              loading={loading}
              className="flex-1"
            />
            <Button
              label="انصراف"
              onPress={onCancel}
              variant="secondary"
              className="flex-1"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
