'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/social';
import InstagramPostCard from '@/components/social/InstagramPostCard';
import CommentSection from '@/components/social/CommentSection';
import InstagramNavbar from '@/components/social/InstagramNavbar';

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  async function fetchPost() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(*)')
      .eq('id', params.id)
      .single();

    setPost(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <InstagramNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black">
        <InstagramNavbar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-white text-center">Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-0">
      <InstagramNavbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <InstagramPostCard post={post} onUpdate={fetchPost} />
        <div className="mt-6">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
}