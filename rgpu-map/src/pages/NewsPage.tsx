import { useState, useEffect } from 'react';
import { NewsList } from '../features/news/components/NewsList';
import { CreateNewsForm } from '../features/news/components/CreateNewsForm';
import { fetchGroups } from '../features/news/api/fakeApi';
import { NewsGroup } from '../features/news/types';

export const NewsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [groups, setGroups] = useState<NewsGroup[]>([]);

  useEffect(() => {
    fetchGroups().then(setGroups);
  }, []);

  return (
    <div className="news-page">
      <button onClick={() => setShowForm(true)}>
        + Создать новость
      </button>

      {showForm && (
        <CreateNewsForm 
          groups={groups} 
          onClose={() => setShowForm(false)}
        />
      )}

      <NewsList />
    </div>
  );
};