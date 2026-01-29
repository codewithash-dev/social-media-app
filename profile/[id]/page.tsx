'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Profile, Post } from '@/types/social';
import FollowButton from '@/components/social/FollowButton';
import InstagramNavbar from '@/components/social/InstagramNavbar';
import Link from 'next/link';

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
        <InstagramNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black">
        <InstagramNavbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-white text-center">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-0">
      <InstagramNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-20 mb-12">
          {/* Avatar */}
          <div className="flex justify-center md:justify-start">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full p-[3px]">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-white text-5xl">{profile.username[0].toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <h1 className="text-white text-2xl">{profile.username}</h1>
              <FollowButton userId={profile.id} />
            </div>

            {/* Stats */}
            <div className="flex gap-8 mb-6 justify-center md:justify-start">
              <div className="text-center md:text-left">
                <span className="text-white font-semibold">{posts.length}</span>
                <span className="text-gray-400 ml-1">posts</span>
              </div>
              <div className="text-center md:text-left">
                <span className="text-white font-semibold">{followers}</span>
                <span className="text-gray-400 ml-1">followers</span>
              </div>
              <div className="text-center md:text-left">
                <span className="text-white font-semibold">{following}</span>
                <span className="text-gray-400 ml-1">following</span>
              </div>
            </div>

            {/* Bio */}
            <div className="text-center md:text-left">
              <p className="text-white font-semibold">{profile.full_name}</p>
              {profile.bio && <p className="text-gray-300 mt-2">{profile.bio}</p>}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="border-t border-gray-800 pt-12">
          <div className="flex justify-center gap-12 mb-8">
            <button className="flex items-center gap-2 text-white font-semibold border-t-2 border-white pt-3 -mt-[49px]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              POSTS
            </button>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {posts.map((post) => (
                <Link key={post.id} href={`/projects/social-media/post/${post.id}`}>
                  <div className="aspect-square bg-gray-900 hover:opacity-75 transition cursor-pointer relative group">
                    {post.image_url ? (
                      <>
                        <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-6 text-white">
                            <div className="flex items-center gap-2">
                              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                              <span>{post.likes_count}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>{post.comments_count}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 p-4">
                        <p className="text-white text-sm text-center line-clamp-6">{post.content}</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-400 text-lg font-semibold">No Posts Yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}