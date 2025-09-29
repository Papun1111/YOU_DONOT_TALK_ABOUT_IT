import { useState, useEffect, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type Room, type Challenge, type Submission, type PuzzleChallenge, type DareChallenge } from '../types';
import { getChallengesForRoom, createChallenge } from '../api/challenges';
import { getRoomByKey } from '../api/room'; // Corrected import path

// UI Components
import Spinner from '../components/ui/Spinner';
import PuzzleCard from '../components/rooms/PuzzleCard';
import DareCard from '../components/rooms/DareCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import GlitchHeading from '../components/ui/GlitchHeading';
import {  Trophy } from 'lucide-react';

// ============================================================================
// --- MAIN PAGE COMPONENT ---
// ============================================================================
const RoomDetailPage = () => {
  const { user } = useAuth();
  const { roomKey } = useParams<{ roomKey: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!user || !roomKey) return;
      setIsLoading(true);
      try {
        const currentRoom = await getRoomByKey(roomKey);
        setRoom(currentRoom);
        setIsOwner(currentRoom.ownerId === user._id);
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : 'Failed to load room details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoomDetails();
  }, [roomKey, user]);

  if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  if (error) return <div className="text-center text-yellow-400">{error}</div>;
  if (!room) return null;

  return isOwner 
    ? <RoomMasterView room={room} /> 
    : <ChallengerView room={room} />;
};


// ============================================================================
// --- ROOM MASTER VIEW ---
// ============================================================================
const RoomMasterView = ({ room }: { room: Room }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
        setIsLoadingChallenges(true);
        try {
            const challengesData = await getChallengesForRoom(room.key);
            setChallenges(challengesData);
        } catch (error) {
            console.error('Failed to fetch challenges:', error);
        } finally {
            setIsLoadingChallenges(false);
        }
    };
    fetchChallenges();
  }, [room.key]);

  const handleChallengeCreated = (newChallenge: Challenge) => {
    setChallenges(prev => [...prev, newChallenge]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <GlitchHeading text={`Manage Room: ${room.name}`} as="h1" className="text-3xl text-center" />
      <ChallengeCreator roomId={room._id} onChallengeCreated={handleChallengeCreated} />
      <Card>
        <h3 className="text-lg text-yellow-400 mb-4">Current Gauntlet ({challenges.length} challenges)</h3>
        {isLoadingChallenges ? <Spinner /> : challenges.length > 0 ? (
            <ul className="list-disc list-inside text-gray-400 text-sm space-y-2">
                {challenges.map(c => (
                    <li key={c._id}>
                        <span className={`font-bold ${c.type === 'puzzle' ? 'text-cyan-400' : 'text-red-400'}`}>
                            [{c.type.toUpperCase()}]
                        </span> {c.title}
                    </li>
                ))}
            </ul>
        ) : <p className="text-gray-500">No challenges created yet. Add one above to build your gauntlet.</p>}
      </Card>
    </div>
  );
};


// ============================================================================
// --- CHALLENGER VIEW ---
// ============================================================================
const ChallengerView = ({ room }: { room: Room }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      try {
        const data = await getChallengesForRoom(room.key);
        setChallenges(data);
      } catch (e) { 
        setError(e instanceof Error ? e.message : 'Could not load challenges.'); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchChallenges();
  }, [room]);

  // This is the core logic that advances the user to the next challenge.
  const handleChallengeComplete = (submission: Submission) => {
    setTotalScore(prev => prev + submission.scoreDelta);
    const nextIndex = currentChallengeIndex + 1;

    if (nextIndex < challenges.length) {
      // If there are more challenges, update the index to show the next one.
      setCurrentChallengeIndex(nextIndex);
    } else {
      // If this was the last challenge, the gauntlet is complete.
      setIsComplete(true);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  if (error) return <div className="text-center text-yellow-400">{error}</div>;
  
  if (isComplete) {
    return <GauntletSuccessView roomName={room.name} finalScore={totalScore} />;
  }
  
  if (challenges.length === 0) {
    return <div className="text-center text-gray-400 py-12">The Room Master has not created any challenges for this room yet.</div>;
  }
  
  const currentChallenge = challenges[currentChallengeIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <GlitchHeading text={`Entering: ${room.name}`} as="h1" className="text-3xl mb-2 text-center" />
      <p className="text-center text-gray-400 mb-8">Challenge {currentChallengeIndex + 1} of {challenges.length}</p>

      {/* Conditionally render PuzzleCard or DareCard based on the challenge type */}
      {currentChallenge.type === 'puzzle' && (
        <PuzzleCard 
          puzzle={currentChallenge as PuzzleChallenge} 
          onComplete={handleChallengeComplete} 
        />
      )}
      {currentChallenge.type === 'dare' && (
        <DareCard 
          dare={currentChallenge as DareChallenge} 
          onComplete={handleChallengeComplete} 
        />
      )}
    </div>
  );
};


// ============================================================================
// --- HELPER & SUB-COMPONENTS ---
// ============================================================================
const ChallengeCreator = ({ roomId, onChallengeCreated }: { roomId: string; onChallengeCreated: (c: Challenge) => void;}) => {
    const [challengeType, setChallengeType] = useState<'puzzle' | 'dare'>('puzzle');
    const [title, setTitle] = useState('');
    const [prompt, setPrompt] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctIndex, setCorrectIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string|null>(null);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options]; newOptions[index] = value; setOptions(newOptions);
    };

    const resetForm = () => {
        setTitle(''); setPrompt(''); setOptions(['', '', '', '']); setCorrectIndex(0);
    };

    const handleCreateChallenge = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const commonData = { roomId, title, prompt, difficulty: 2 };
        let challengeData;

        if (challengeType === 'puzzle') {
            challengeData = { ...commonData, type: 'puzzle' as const, options };
        } else {
            challengeData = { ...commonData, type: 'dare' as const };
        }

        try {
            const newChallenge = await createChallenge(challengeData);
            onChallengeCreated(newChallenge);
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create challenge");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Card>
            <h3 className="text-lg text-yellow-400 mb-4">Create a New Challenge</h3>
            <div className="flex gap-2 mb-4">
                <Button variant={challengeType === 'puzzle' ? 'primary' : 'secondary'} onClick={() => setChallengeType('puzzle')}>Puzzle</Button>
                <Button variant={challengeType === 'dare' ? 'primary' : 'secondary'} onClick={() => setChallengeType('dare')}>Dare</Button>
            </div>
            <form onSubmit={handleCreateChallenge} className="space-y-4">
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Challenge Title" required />
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={challengeType === 'puzzle' ? "Puzzle Prompt/Question..." : "Dare Prompt..."} required className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
                
                {challengeType === 'puzzle' && (
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Options (select correct answer)</label>
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="radio" name="correctOption" checked={correctIndex === index} onChange={() => setCorrectIndex(index)} className="h-4 w-4 text-red-600 bg-gray-800 border-gray-600 focus:ring-red-500" />
                                <Input type="text" value={option} onChange={e => handleOptionChange(index, e.target.value)} placeholder={`Option ${index + 1}`} required />
                            </div>
                        ))}
                    </div>
                )}

                {error && <p className="text-sm text-yellow-400">{error}</p>}
                <Button type="submit" className="w-full" isLoading={isSubmitting}>Add Challenge to Gauntlet</Button>
            </form>
        </Card>
    );
};

const GauntletSuccessView = ({ roomName, finalScore }: { roomName: string, finalScore: number }) => (
  <div className="text-center py-12">
    <GlitchHeading text="Gauntlet Complete!" as="h2" className="text-3xl text-green-400 mb-4" />
    <div className="mb-8"><Trophy className="h-20 w-20 mx-auto text-yellow-400 mb-4" />
      <p className="text-xl text-gray-300">You have conquered the trials of {roomName}!</p>
    </div>
    <Card className="max-w-md mx-auto">
        <p className="text-lg">Total Score Earned: <span className="font-bold text-green-400">{finalScore} points</span></p>
    </Card>
  </div>
);

export default RoomDetailPage;

