import { type Post } from '../../types';
import { formatTimeAgo } from '../../utils/date';
import Card from '../ui/Card';
import { motion } from 'framer-motion';
import { ThumbsUp } from 'lucide-react';
import ReportButton from './ReportButton';
import { useState } from 'react';
import { reactToPost } from '../../api/posts';

interface AnonPostProps {
  post: Post;
}

/**
 * Displays a single anonymous post, including user info, content, and actions.
 * Features a subtle "unreliable narrator" visual effect on hover.
 */
const AnonPost = ({ post }: AnonPostProps) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  
  const handleUpvote = async () => {
    if (isUpvoted) return; // Prevent multiple upvotes
    try {
      await reactToPost(post._id, 'upvote');
      setIsUpvoted(true);
      // Optionally, you could update a local count state here
    } catch (error) {
      console.error("Failed to upvote post:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 relative group">
        <div className="flex items-start space-x-4">
          <img
            src={post.user?.publicAvatar}
            alt={`${post.user?.publicName}'s avatar`}
            className="w-10 h-10 rounded-full border-2 border-gray-600"
          />
          <div className="flex-1">
            <div className="flex items-baseline space-x-2">
              <span className="font-semibold text-red-400">{post.user?.publicName}</span>
              <span className="text-xs text-gray-500">
                · {formatTimeAgo(post.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-gray-300 whitespace-pre-wrap">{post.body}</p>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex items-center space-x-2">
           <button 
             onClick={handleUpvote}
             disabled={isUpvoted}
             className={`p-2 rounded-full transition-colors ${
              isUpvoted 
                ? 'text-red-500' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
             }`}
             aria-label="Upvote post"
           >
            <ThumbsUp size={16} />
          </button>
          <ReportButton postId={post._id} />
        </div>
        {/* Unreliable Narrator Effect: Scanline overlay on hover */}
        <div className="absolute inset-0 w-full h-full bg-[url('/scanlines.png')] opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
      </Card>
    </motion.div>
  );
};

export default AnonPost;
