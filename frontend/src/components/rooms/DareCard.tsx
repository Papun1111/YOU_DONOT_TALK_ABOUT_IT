import { useState, type FormEvent } from 'react';
import type{ DareChallenge, Submission } from '../../types';
import { submitChallenge } from '../../api/challenges';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface DareCardProps {
  dare: DareChallenge;
  onComplete: (submission: Submission) => void;
}

/**
 * A card for responding to and submitting a writing dare.
 */
const DareCard = ({ dare, onComplete }: DareCardProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 10) {
        setError('Your response must be at least 10 characters long.');
        return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submission = await submitChallenge(dare._id, content);
      onComplete(submission);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Submission failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-yellow-400 mb-2">{dare.title}</h3>
      <p className="text-gray-300 mb-6">{dare.prompt}</p>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something you’d never admit publicly..."
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          rows={5}
          disabled={isSubmitting}
        />
        <div className="flex justify-end items-center mt-4">
            {error && <p className="text-sm text-yellow-400 mr-4">{error}</p>}
            <Button type="submit" isLoading={isSubmitting}>
                Submit Dare
            </Button>
        </div>
      </form>
    </Card>
  );
};

export default DareCard;
