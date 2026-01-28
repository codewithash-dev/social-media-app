'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/social';
import PostCard from '@/components/social/PostCard';
import CreatePost from '@/components/social/CreatePost';
import SocialNavbar from '@/components/social/Navbar';
import { useAuthStore } from '@/lib/social-store';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/projects/social-media');
    }
    setLoading(false);
  }

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false });

    setPosts(data || []);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <SocialNavbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <SocialNavbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <CreatePost onPostCreated={fetchPosts} />
        
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No posts yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}