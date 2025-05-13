import { useState, useEffect } from 'react';
import { CommunityServiceApi, CreateNewsRequest, NewsResponse } from '../../real_api/communityServiceApi';
import { getAccessToken } from '../../../utils/tokenService';

const communityServiceApi = new CommunityServiceApi();

export const useAdminPosts = () => {
  const [posts, setPosts] = useState<NewsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async (retryCount = 3): Promise<void> => {
    if (!getAccessToken()) {
      setError('No access token available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const query = { page: 1, pageSize: 100 };
      const response = await communityServiceApi.community.newsList(query);
      if (response.data.body) {
        setPosts(response.data.body);
      } else {
        setPosts([]);
      }
    } catch (e: any) {
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return loadPosts(retryCount - 1);
      }
      setError(e.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (post: CreateNewsRequest) => {
    setLoading(true);
    setError(null);
    try {
      await communityServiceApi.community.createNewsCreate(post);
      await loadPosts();
    } catch (e: any) {
      setError(e.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const editPost = async (newsId: string, updates: Partial<CreateNewsRequest>) => {
    setLoading(true);
    setError(null);
    try {
      const operations = [];
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

      // Исправленный запрос с newsId
      await communityServiceApi.community.editPartialUpdate(
        operations,
        { communityId: updates.communityId! } // Или newsId, если сервер требует
      );

      // Локальное обновление
      setPosts(prev => 
        prev.map(post => 
          post.newsId === newsId 
            ? { ...post, ...updates } 
            : post
        )
      );
    } catch (e: any) {
      setError('Ошибка обновления: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (newsId: string) => {
    setLoading(true);
    setError(null);
    try {
      await communityServiceApi.community.softdeleteDelete({ communityId: newsId });
      await loadPosts();
    } catch (e: any) {
      setError(e.message || 'Failed to delete post');
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