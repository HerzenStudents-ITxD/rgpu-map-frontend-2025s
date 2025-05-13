import { useState, useEffect } from 'react';
import { 
  CommunityServiceApi, 
  CreateNewsRequest, 
  NewsResponse,
  Operation
} from '../../real_api/communityServiceApi';
import { getAccessToken } from '../../../utils/tokenService';

const communityServiceApi = new CommunityServiceApi();

export const useAdminPosts = () => {
  const [posts, setPosts] = useState<NewsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async (retryCount = 3) => {
    if (!getAccessToken()) {
      setError('Требуется авторизация');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await communityServiceApi.news.newsList({
        page: 1,
        pageSize: 100
      });
      setPosts(response.data.body || []);
    } catch (err) {
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return loadPosts(retryCount - 1);
      }
      setError('Ошибка загрузки: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (post: CreateNewsRequest) => {
    setLoading(true);
    try {
      await communityServiceApi.news.createNewsCreate(post);
      await loadPosts();
    } catch (err) {
      setError('Ошибка создания: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const editPost = async (newsId: string, updates: Partial<CreateNewsRequest>) => {
    setLoading(true);
    try {
      const operations: Operation[] = [];
      
      if (updates.title) operations.push({
        op: 'replace',
        path: '/title',
        value: updates.title
      });
      
      if (updates.text) operations.push({
        op: 'replace',
        path: '/text',
        value: updates.text
      });
      
      if (updates.pointId !== undefined) operations.push({
        op: 'replace',
        path: '/pointId',
        value: updates.pointId
      });
      
      if (updates.communityId) operations.push({
        op: 'replace',
        path: '/communityId',
        value: updates.communityId
      });

      await communityServiceApi.news.editNewsPartialUpdate(
        operations,
        { newsId }
      );
      
      await loadPosts();
    } catch (err) {
      setError('Ошибка обновления: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (newsId: string) => {
    setLoading(true);
    try {
      await communityServiceApi.news.deleteNewsDelete({ newsId });
      await loadPosts();
    } catch (err) {
      setError('Ошибка удаления: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return { 
    posts, 
    loading, 
    error, 
    createPost, 
    editPost, 
    deletePost, 
    refreshPosts: loadPosts 
  };
};