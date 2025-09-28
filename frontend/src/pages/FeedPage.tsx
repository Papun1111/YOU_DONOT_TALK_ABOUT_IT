import { useState, useEffect } from 'react';
import { type Post, type Room } from '../types';
import { getFeed } from '../api/posts';
import { getRooms } from '../api/room';
import { useSocket } from '../hooks/useSocket';
import Spinner from '../components/ui/Spinner';
import GlitchHeading from '../components/ui/GlitchHeading';
import PostComposer from '../components/feed/PostComposer';
import AnonPost from '../components/feed/AnonPost';

/**
 * The anonymous social feed page, featuring real-time updates and room filtering.
 */
const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('global-feed');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for new posts in real-time from the backend's '/feed' namespace.
  const newPost = useSocket<Post>('/feed', 'feed:new_post');

  // Effect to fetch initial data (posts and rooms)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch posts for the currently selected room
        const postData = await getFeed(selectedRoomId === 'global-feed' ? undefined : selectedRoomId);
        // FIX: Ensure postData is an array before setting state to prevent .map errors.
        setPosts(Array.isArray(postData) ? postData : []);

        // Fetch the list of rooms for the dropdown selector
        const roomData = await getRooms();
        // Also apply the same safeguard for rooms data.
        setRooms(Array.isArray(roomData) ? roomData : []);

      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : 'Could not load data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedRoomId]); // Re-fetch posts when the selected room changes

  // Effect to handle incoming real-time posts from the socket
  useEffect(() => {
    if (newPost) {
      // Add the new post to the top of the list if it belongs to the
      // currently viewed room or if the user is viewing the global feed.
      if (newPost.roomId === selectedRoomId || selectedRoomId === 'global-feed') {
          // Prevent duplicates from the optimistic update
          setPosts(prevPosts => {
              if (prevPosts.some(p => p._id === newPost._id)) {
                  return prevPosts;
              }
              return [newPost, ...prevPosts];
          });
      }
    }
  }, [newPost, selectedRoomId]);

  const handlePostCreated = (createdPost: Post) => {
    // This function is called immediately after the user submits a post.
    // We add it to the state for instant feedback, even before the socket event arrives.
    if (createdPost.roomId === selectedRoomId || (selectedRoomId === 'global-feed' && rooms.some(r => r._id === createdPost.roomId))) {
        setPosts(prevPosts => [createdPost, ...prevPosts]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <GlitchHeading text="The Feed" as="h1" className="text-3xl mb-4 text-center" />
      
      <div className="mb-8">
          <label htmlFor="room-filter" className="block text-sm text-gray-400 mb-1">Filter by Room</label>
          <select
            id="room-filter"
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
          >
            <option value="global-feed">All Rooms</option>
            {rooms.map(room => (
              <option key={room._id} value={room._id}>{room.name}</option>
            ))}
          </select>
      </div>

      <PostComposer onPostCreated={handlePostCreated} roomId={selectedRoomId} />

      {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
      {error && <p className="text-center text-yellow-400 py-4">{error}</p>}
      
      <div className="space-y-4">
        {!isLoading && posts.length === 0 && (
           <div className="text-center py-12 text-gray-500">
             <p>No transmissions yet for this room.</p>
             <p className="text-sm">Be the first to break the silence.</p>
           </div>
        )}
        {posts.map(post => (
          <AnonPost key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default FeedPage;

