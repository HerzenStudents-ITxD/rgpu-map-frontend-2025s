import { useState, useEffect } from 'react';
import { CommunityServiceApi, CreateNewsRequest, NewsResponse } from '../../features/real_api/communityServiceApi';
import { getAccessToken } from '../../utils/tokenService';

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
      const response = await communityServiceApi.community.newsList({ page: 1, pageSize: 100 });
      if (response.data.body) {
        setPosts(response.data.body);
      } else {
        throw new Error('No posts found in response');
      }
    } catch (e: any) {
      console.error('Error loading posts:', e);
      if (retryCount > 0) {
        console.log(`Retrying... Attempts left: ${retryCount}`);
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
      const response = await communityServiceApi.community.createNewsCreate(post);
      if (response.data.body) {
        await loadPosts();
      } else {
        throw new Error('Failed to create post');
      }
    } catch (e: any) {
      console.error('Error creating post:', e);
      setError(e.message || 'Failed to create post');
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
      if (updates.content) operations.push({ op: 'replace', path: '/content', value: updates.content });
      if (updates.isFeatured !== undefined) operations.push({ op: 'replace', path: '/isFeatured', value: updates.isFeatured });
      if (updates.location !== undefined) operations.push({ op: 'replace', path: '/location', value: updates.location });
      if (updates.images !== undefined) operations.push({ op: 'replace', path: '/images', value: updates.images });
      const success = await communityServiceApi.community.editPartialUpdate(operations, { communityId: updates.communityId });
      if (success.data.body) {
        await loadPosts();
      } else {
        throw new Error('Failed to update post');
      }
    } catch (e: any) {
      console.error('Error updating post:', e);
      setError(e.message || 'Failed to update post');
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
        throw new Error('Failed to delete post');
      }
    } catch (e: any) {
      console.error('Error deleting post:', e);
      setError(e.message || 'Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return { posts, loading, error, createPost, editPost, deletePost };
};