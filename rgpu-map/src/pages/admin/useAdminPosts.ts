import { useState, useEffect } from 'react';
import { CommunityServiceApi, NewsResponseFindResultResponse, CreateNewsRequest, NewsResponse } from '../../features/real_api/communityServiceApi';

const communityServiceApi = new CommunityServiceApi();

export const useAdminPosts = () => {
  const [posts, setPosts] = useState<NewsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityServiceApi.community.newsList({ page: 1, pageSize: 100 });
      setPosts(response.data.body || []);
    } catch (e) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (post: CreateNewsRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityServiceApi.community.createNewsCreate(post);
      if (response.data.body) {
        await loadPosts();
      } else {
        setError('Failed to create post');
      }
    } catch (e) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const editPost = async (newsId: string, updates: Partial<CreateNewsRequest>) => {
    setLoading(true);
    setError(null);
    try {
      const operations: { op: string; path: string; value: any }[] = [];
      if (updates.title) operations.push({ op: 'replace', path: '/title', value: updates.title });
      if (updates.content) operations.push({ op: 'replace', path: '/text', value: updates.content });
      if (updates.isFeatured !== undefined) operations.push({ op: 'replace', path: '/isFeatured', value: updates.isFeatured });
      const success = await communityServiceApi.community.editPartialUpdate(operations, { communityId: updates.communityId });
      if (success.data.body) {
        await loadPosts();
      } else {
        setError('Failed to update post');
      }
    } catch (e) {
      setError('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (newsId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await communityServiceApi.community.softdeleteDelete({ communityId: newsId });
      if (success.data.body) {
        await loadPosts();
      } else {
        setError('Failed to delete post');
      }
    } catch (e) {
      setError('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return { posts, loading, error, createPost, editPost, deletePost };
};