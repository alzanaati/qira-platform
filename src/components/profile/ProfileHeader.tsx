'use client';
import { User } from '@/types';
import Avatar from '@/components/ui/Avatar';
interface ProfileHeaderProps { user: User; streamCount: number; followerCount: number; followingCount: number; isOwnProfile: boolean; isFollowing: boolean; onFollow: () => void; }
export default function ProfileHeader({ user, streamCount, followerCount, followingCount, isOwnProfile, isFollowing, onFollow }: ProfileHeaderProps) {
  return (
    <div className="bg-gray-900 border-b border-gray-800 p-6">
      <div className="flex items-start gap-4">
        <Avatar user={user} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-white font-bold text-xl truncate">{user.full_name || user.username}</h1>
            {user.is_verified && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">✓ موثّق</span>}
          </div>
          <p className="text-gray-400 text-sm">@{user.username}</p>
          {user.bio && <p className="text-gray-300 text-sm mt-2">{user.bio}</p>}
        </div>
        {!isOwnProfile && (
          <button onClick={onFollow}
            className={'px-6 py-2 rounded-full text-sm font-medium transition-all ' + (isFollowing ? 'bg-gray-700 hover:bg-red-900/50 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white')}>
            {isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
          </button>
        )}
      </div>
      <div className="flex gap-6 mt-4 pt-4 border-t border-gray-800">
        {[['بث', streamCount], ['متابِع', followerCount], ['متابَع', followingCount]].map(([label, count]) => (
          <div key={String(label)} className="text-center">
            <div className="text-white font-bold text-lg">{count}</div>
            <div className="text-gray-400 text-xs">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}