import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Challenge,type Submission } from '../types';

import Spinner from '../components/ui/Spinner';
import PuzzleCard from '../components/rooms/PuzzleCard';
import DareCard from '../components/rooms/DareCard';
import GlitchHeading from '../components/ui/GlitchHeading';

/**
 * The main gameplay page where a user participates in challenges for a specific room.
 */
const RoomDetailPage = () => {
  const { roomKey } = useParams<{ roomKey: string }>();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionScore, setSessionScore] = useState(0);

  useEffect(() => {
    if (!roomKey) return;
    const fetchChallenges = async () => {
      try {
        // In a real app, you would fetch challenges for the specific roomKey
        // For this example, we'll imagine a getChallenges function exists.
        // const data = await getChallengesForRoom(roomKey);
        // setChallenges(data);
        console.log(`Fetching challenges for ${roomKey}`);
        // Mock data for now:
        const mockChallenges: Challenge[] = [
            { _id: '1', roomId: '1', type: 'puzzle', title: 'Logic Riddle', prompt: 'What has an eye, but cannot see?', options: ['A needle', 'A potato', 'A storm', 'A hurricane'], difficulty: 2, active: true, createdAt: new Date().toISOString() },
            { _id: '2', roomId: '1', type: 'dare', title: 'A Minor Confession', prompt: 'Describe a time you got away with something.', difficulty: 3, active: true, createdAt: new Date().toISOString() }
        ];
        setChallenges(mockChallenges);
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : 'Could not load challenges.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenges();
  }, [roomKey]);

  const handleChallengeComplete = (submission: Submission) => {
    setSessionScore(prev => prev + submission.scoreDelta);
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
    } else {
      // End of challenges
      navigate('/rooms', { state: { finalScore: sessionScore + submission.scoreDelta } });
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  if (error) return <div className="text-center text-yellow-400">{error}</div>;
  if (challenges.length === 0) return <div className="text-center">No active challenges in this room.</div>;
  
  const currentChallenge = challenges[currentChallengeIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <GlitchHeading text={`Room: ${roomKey}`} as="h1" className="text-3xl mb-2 text-center" />
      <p className="text-center text-gray-400 mb-8">Challenge {currentChallengeIndex + 1} of {challenges.length}</p>

      {currentChallenge.type === 'puzzle' && (
        <PuzzleCard puzzle={currentChallenge} onComplete={handleChallengeComplete} />
      )}
      {currentChallenge.type === 'dare' && (
        <DareCard dare={currentChallenge} onComplete={handleChallengeComplete} />
      )}
    </div>
  );
};

export default RoomDetailPage;
