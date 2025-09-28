import { useState,type FormEvent } from 'react';
import { createPost } from '../../api/posts';
import Button from '../ui/Button';
import Card from '../ui/Card';
import {type Post } from '../../types';

interface PostComposerProps {
  onPostCreated: (newPost: Post) => void;
  roomId: string; // To associate the post with a room
}

/**
 * A form component for users to compose and submit new anonymous posts,
 * using standard React state for form management.
 */
const PostComposer = ({ onPostCreated, roomId }: PostComposerProps) => {
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    if (body.trim().length < 3) {
      setError("Must be at least 3 characters.");
      return false;
    }
    if (body.length > 280) {
      setError("Cannot exceed 280 characters.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newPost = await createPost(body, roomId);
      onPostCreated(newPost);
      setBody(''); // Reset form
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <form onSubmit={handleSubmit}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?..."
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          rows={3}
          aria-label="New post content"
        />
        <div className="flex justify-between items-center mt-3">
          <div>
            {error && <p className="text-sm text-yellow-400">{error}</p>}
          </div>
          <Button type="submit" isLoading={isSubmitting}>
            Transmit
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PostComposer;

