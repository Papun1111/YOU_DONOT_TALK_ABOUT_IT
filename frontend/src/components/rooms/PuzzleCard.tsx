import { useState, useEffect } from 'react';
import { type PuzzleChallenge, type Submission } from '../../types';
import { submitChallenge } from '../../api/challenges';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface PuzzleCardProps {
  puzzle: PuzzleChallenge;
  onComplete: (submission: Submission) => void;
}

/**
 * An interactive card for solving a multiple-choice puzzle challenge.
 * It provides feedback for correct/incorrect answers and only proceeds when solved.
 */
const PuzzleCard = ({ puzzle, onComplete }: PuzzleCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- FIX: This useEffect hook now depends on the puzzle's unique ID. ---
  // This is a more reliable way to ensure the component resets its state
  // every time a new puzzle is displayed.
  useEffect(() => {
    setSelectedOption(null);
    setFeedback(null);
    setError(null);
    setStartTime(Date.now());
  }, [puzzle._id]);

  const handleSubmit = async () => {
    if (selectedOption === null) return;

    setIsSubmitting(true);
    setError(null);
    setFeedback(null);
    const timeMs = Date.now() - startTime;

    try {
      const submission = await submitChallenge(puzzle._id, selectedOption.toString(), timeMs);
      
      if (submission.isCorrect) {
        setFeedback('correct');
        // If correct, wait 1.5s to show feedback, then call onComplete to move to the next challenge.
        setTimeout(() => onComplete(submission), 1500);
      } else {
        setFeedback('incorrect');
        // If incorrect, show feedback, then reset after 1.5s to allow another try.
        // It does NOT call onComplete, so the user doesn't advance.
        setTimeout(() => {
          setFeedback(null);
          setSelectedOption(null);
          setIsSubmitting(false);
        }, 1500);
      }
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Submission failed.');
      setIsSubmitting(false);
    }
  };
  
  // Dynamically style buttons based on selection and feedback for a better UX.
  const getButtonClass = (index: number) => {
    const isSelected = selectedOption === index;
    if (feedback === 'correct' && isSelected) return 'bg-green-600 hover:bg-green-700';
    if (feedback === 'incorrect' && isSelected) return 'bg-red-800 hover:bg-red-900 animate-shake';
    if (isSelected) return 'bg-red-600';
    return 'bg-gray-700 hover:bg-gray-600';
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-yellow-400 mb-2">{puzzle.title}</h3>
      <p className="text-gray-300 mb-6">{puzzle.prompt}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {puzzle.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => setSelectedOption(index)}
            disabled={isSubmitting || feedback !== null}
            className={getButtonClass(index)}
          >
            {option}
          </Button>
        ))}
      </div>
      
      <div className="mt-6 text-center h-10">
        {feedback === null && (
           <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={selectedOption === null}>
            Submit Answer
          </Button>
        )}
        {feedback === 'correct' && <p className="text-lg font-bold text-green-400">Correct! Proceeding...</p>}
        {feedback === 'incorrect' && <p className="text-lg font-bold text-red-500">Incorrect. Try again.</p>}
        {error && <p className="text-sm text-yellow-400 mt-2">{error}</p>}
      </div>
    </Card>
  );
};

export default PuzzleCard;

