import { useState, useEffect } from 'react';
import type{ PuzzleChallenge, Submission } from '../../types';
import { submitChallenge } from '../../api/challenges';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface PuzzleCardProps {
  puzzle: PuzzleChallenge;
  onComplete: (submission: Submission) => void;
}

/**
 * An interactive card for solving a multiple-choice puzzle challenge.
 * It handles answer selection, timing, submission, and feedback.
 */
const PuzzleCard = ({ puzzle, onComplete }: PuzzleCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, [puzzle]);

  const handleSubmit = async () => {
    if (selectedOption === null || !startTime) return;

    setIsSubmitting(true);
    setError(null);
    const timeMs = Date.now() - startTime;

    try {
      const submission = await submitChallenge(puzzle._id, selectedOption.toString(), timeMs);
      setResult(submission.isCorrect ? 'correct' : 'incorrect');
      setTimeout(() => onComplete(submission), 1500); // Wait before moving to next
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Submission failed.');
      setIsSubmitting(false);
    }
  };
  
  const getButtonVariant = (index: number) => {
    if (result) {
      return 'secondary'; // All buttons become neutral after answering
    }
    return selectedOption === index ? 'primary' : 'secondary';
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-yellow-400 mb-2">{puzzle.title}</h3>
      <p className="text-gray-300 mb-6">{puzzle.prompt}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {puzzle.options.map((option, index) => (
          <Button
            key={index}
            variant={getButtonVariant(index)}
            onClick={() => !result && setSelectedOption(index)}
            disabled={isSubmitting || !!result}
          >
            {option}
          </Button>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        {!result ? (
           <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={selectedOption === null}>
            Submit Answer
          </Button>
        ) : (
          <p className={`text-lg font-bold ${result === 'correct' ? 'text-green-400' : 'text-red-500'}`}>
            {result === 'correct' ? 'Correct!' : 'Incorrect.'}
          </p>
        )}
         {error && <p className="text-sm text-yellow-400 mt-2">{error}</p>}
      </div>
    </Card>
  );
};

export default PuzzleCard;
