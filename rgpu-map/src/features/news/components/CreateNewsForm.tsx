// src/features/news/components/CreateNewsForm.tsx
import { useState } from 'react';
import { createNews } from '../api/fakeApi';
import { NewsGroup } from '../types';

export const CreateNewsForm = ({ 
  groups,
  onClose 
}: {
  groups: NewsGroup[];
  onClose: () => void;
}) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    groupId: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const group = groups.find(g => g.id === form.groupId);
    if (!group || !form.title) return;

    await createNews({
      title: form.title,
      content: form.content,
      group,
      date: new Date().toISOString(),
      location: form.location || undefined
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="news-form">
      <select
        value={form.groupId}
        onChange={(e) => setForm({...form, groupId: e.target.value})}
        required
      >
        <option value="">Выберите группу</option>
        {groups.map(g => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Заголовок"
        value={form.title}
        onChange={(e) => setForm({...form, title: e.target.value})}
        required
      />

      <textarea
        placeholder="Текст новости"
        value={form.content}
        onChange={(e) => setForm({...form, content: e.target.value})}
      />

      <input
        type="text"
        placeholder="Местоположение (необязательно)"
        value={form.location}
        onChange={(e) => setForm({...form, location: e.target.value})}
      />

      <div className="form-actions">
        <button type="button" onClick={onClose}>Отменить</button>
        <button type="submit">Опубликовать</button>
      </div>
    </form>
  );
};