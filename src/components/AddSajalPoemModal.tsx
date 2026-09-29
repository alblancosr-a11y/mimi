"use client";

import { useState, useEffect } from 'react';
import { X, FileText, User, Swords } from 'lucide-react';
import type { SajalPoem, Verse } from '../lib/types';
import { parsePoem } from '../lib/poem-parser';
import { Button, Input, TextArea, Badge } from '../ui';
import { tGender } from '../lib/arabicUtils';
import { UserProfile } from '../lib/types';

interface Props {
  userProfile: UserProfile;
  onClose: () => void;
  onAdd: (poem: SajalPoem) => void;
  editPoem?: SajalPoem;
}

export default function AddSajalPoemModal({ userProfile, onClose, onAdd, editPoem }: Props) {
  const [title, setTitle] = useState(editPoem?.title || '');
  const [poet, setPoet] = useState(editPoem?.poet || '');
  const [rawText, setRawText] = useState(editPoem?.rawText || '');
  const [verses, setVerses] = useState<Verse[]>(editPoem?.verses || []);
  const [error, setError] = useState('');

  useEffect(() => {
    setVerses(rawText.trim() ? parsePoem(rawText) : []);
  }, [rawText]);

  const handleSubmit = () => {
    if (!rawText.trim()) {
      setError(tGender(userProfile, 'أدخلي نص القصيدة', 'أدخل نص القصيدة'));
      return;
    }

    if (!verses.length) {
      setError(tGender(userProfile, 'لم يُتعرف على أبيات — كل سطرين بيت', 'لم يتم التعرف على أبيات — كل سطرين بيت'));
      return;
    }

    onAdd({
      id: editPoem?.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: title.trim() || 'قصيدة بدون عنوان',
      poet: poet.trim() || 'شاعر غير معروف',
      rawText: rawText.trim(),
      verses,
      createdAt: editPoem?.createdAt || Date.now(),
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="w-full max-w-lg glass-modal rounded-3xl overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--border-0)] flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3 -translate-x-4 translate-y-0.5">
             <Swords size={18} className="text-[var(--accent)]" />
             <h2 className="text-lg font-bold text-[var(--text-0)]">
                {editPoem ? 'تعديل قصيدة السجال' : 'إضافة قصيدة للسجال'}
             </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[var(--text-3)] hover:text-[var(--text-0)] hover:bg-[var(--bg-2)] transition-colors translate-x-2 translate-y-0.5">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-8 flex flex-col gap-6 max-h-[70dvh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold text-[var(--text-3)] uppercase tracking-widest px-1 -translate-x-3 translate-y-1">اسم القصيدة</label>
            <div className="relative">
              <FileText size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-3)] opacity-40" />
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="مثال: لاميّة العرب"
                className="!pr-12"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold text-[var(--text-3)] uppercase tracking-widest px-1 -translate-x-3 translate-y-1">الشاعر</label>
            <div className="relative">
              <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-3)] opacity-40" />
              <Input
                value={poet}
                onChange={e => setPoet(e.target.value)}
                placeholder="مثال: الشنفرى"
                className="!pr-12"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] font-extrabold text-[var(--text-3)] uppercase tracking-widest -translate-x-3 translate-y-1">نص القصيدة</label>
              {/* تمت إزاحة البادج وكلمة بيت نحو اليمين باستخدام -translate-x-8 */}
              <div className="translate-x-2 translate-y-0.5">
                <Badge variant="accent">
                  {verses.length} بيت
                </Badge>
              </div>
           </div>
            <TextArea
              value={rawText}
              onChange={e => { setRawText(e.target.value); setError(''); }}
              placeholder={tGender(userProfile, 'اكتبي الأبيات هنا...', 'اكتب الأبيات هنا...')}
              rows={8}
              dir="rtl"
              style={{ fontFamily: 'var(--font-poem)', fontSize: '1.1rem', lineHeight: '1.8' }}
              className="bg-white/5 border-[var(--border-1)] focus:border-[var(--accent)] !pr-6"
            />
            {error && <p className="text-[10px] text-[var(--error)] font-bold px-1">{error}</p>}
          </div>
        </div>

       {/* Footer */}
        <div className="px-6 py-5 border-t border-[var(--border-0)] flex items-center justify-between bg-white/5">
          <Button variant="ghost" size="sm" onClick={onClose} className="font-bold -translate-x-4">إلغاء</Button>
          <Button variant="primary" size="md" onClick={handleSubmit} className="!px-8 shadow-md translate-x-2">
            {editPoem ? 'حفظ التعديلات' : 'إضافة للمضمار'}
          </Button>
        </div>
      </div>
    </div>
  );
}