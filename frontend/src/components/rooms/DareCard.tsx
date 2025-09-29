import { useState, useEffect, type FormEvent } from 'react';
import { type DareChallenge, type Submission } from '../../types';
import { submitChallenge } from '../../api/challenges';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface DareCardProps {
  dare: DareChallenge;
  onComplete: (submission: Submission) => void;
}

/**
 * A card for responding to and submitting a writing dare.
 * Provides clear user feedback upon successful submission.
 */
const DareCard = ({ dare, onComplete }: DareCardProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'success' | null>(null);

  // --- FIX: This useEffect resets the component's state when a new dare is received ---
  useEffect(() => {
    setContent('');
    setIsSubmitting(false);
    setError(null);
    setFeedback(null);
  }, [dare]); // The hook runs every time the 'dare' prop changes

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
      setFeedback('success');
      // Wait 1.5s to show feedback, then proceed to the next challenge.
      setTimeout(() => onComplete(submission), 1500);
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
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50"
          rows={5}
          disabled={isSubmitting || feedback === 'success'}
        />
        <div className="flex justify-end items-center mt-4 h-10">
            {error && <p className="text-sm text-yellow-400 mr-4">{error}</p>}
            
            {feedback === 'success' ? (
                <p className="text-lg font-bold text-green-400">Submission received. Proceeding...</p>
            ) : (
                <Button type="submit" isLoading={isSubmitting}>
                    Submit Dare
                </Button>
            )}
        </div>
      </form>
    </Card>
  );
};

export default DareCard;

