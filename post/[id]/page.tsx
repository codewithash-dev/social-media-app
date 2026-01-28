'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/social';
import PostCard from '@/components/social/PostCard';
import CommentSection from '@/components/social/CommentSection';
import SocialNavbar from '@/components/social/Navbar';

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
        <SocialNavbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black">
        <SocialNavbar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-white text-center">Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <SocialNavbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <PostCard post={post} onUpdate={fetchPost} />
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}