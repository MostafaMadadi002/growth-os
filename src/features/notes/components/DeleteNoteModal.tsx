import React from 'react';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteNoteModal({ isOpen, onCancel, onConfirm, loading }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">حذف یادداشت</h2>
        <p className="text-slate-400 mb-8 text-center leading-relaxed">
          آیا از حذف این یادداشت اطمینان دارید؟ این عمل قابل بازگشت نیست.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-colors"
          >
            {loading ? 'در حال حذف...' : 'بله، حذف شود'}
          </button>
          <button 
            onClick={onCancel}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-colors"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}
