'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Profile, Post } from '@/types/social';
import PostCard from '@/components/social/PostCard';
import FollowButton from '@/components/social/FollowButton';
import SocialNavbar from '@/components/social/Navbar';

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    fetchStats();
  }, [params.id]);

  async function fetchProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.id)
      .single();

    setProfile(data);
    setLoading(false);
  }

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(*)')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false });

    setPosts(data || []);
  }

  async function fetchStats() {
    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', params.id);

    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', params.id);

    setFollowers(followersCount || 0);
    setFollowing(followingCount || 0);
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-black">
        <SocialNavbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-white text-center">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <SocialNavbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-24 h-24 rounded-full" />
                ) : (
                  <span className="text-white text-3xl">{profile.username[0].toUpperCase()}</span>
                )}
              </div>
              <div>
                <h1 className="text-white text-3xl font-bold">{profile.full_name || profile.username}</h1>
                <p className="text-gray-400">@{profile.username}</p>
              </div>
            </div>
            <FollowButton userId={profile.id} />
          </div>

          {profile.bio && <p className="text-gray-300 mb-6">{profile.bio}</p>}

          <div className="flex gap-8 text-center">
            <div>
              <p className="text-white text-2xl font-bold">{posts.length}</p>
              <p className="text-gray-400">Posts</p>
            </div>
            <div>
              <p className="text-white text-2xl font-bold">{followers}</p>
              <p className="text-gray-400">Followers</p>
            </div>
            <div>
              <p className="text-white text-2xl font-bold">{following}</p>
              <p className="text-gray-400">Following</p>
            </div>
          </div>
        </div>

        <h2 className="text-white text-2xl font-bold mb-4">Posts</h2>
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}