import { useState, useEffect } from 'react';
import {type LeaderboardItem } from '../types';
import GlitchHeading from '../components/ui/GlitchHeading';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
// We'll need to create this API function
// import { getGlobalLeaderboard } from '../api/leaderboard';

/**
 * Page for displaying the global user leaderboard.
 */
const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // const data = await getGlobalLeaderboard();
        // setLeaderboard(data);
        // Mock data until API is ready
        const mockData: LeaderboardItem[] = [
          { rank: 1, userId: '1', publicName: 'Glitched_Ghost_123', publicAvatar: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iaHNsKDAsIDUwJSwgMjUlKSIgLz48L3N2Zz4=', score: 12500 },
          { rank: 2, userId: '2', publicName: 'Silent_Cipher_456', publicAvatar: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iaHNsKDE4MCwgNTAlLCAyNSUpIiAvPjwvc3ZnPg==', score: 11800 },
          { rank: 3, userId: '3', publicName: 'Rogue_Variable_789', publicAvatar: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iaHNsKDkwLCA1MCUsIDI1JSkiIC8+PC9zdmc+', score: 10500 },
        ];
        setLeaderboard(mockData);
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : 'Could not load leaderboard.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (error) {
    return <div className="text-center text-yellow-400">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <GlitchHeading text="Global Leaderboard" as="h1" className="text-3xl mb-8 text-center" />
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800/50 divide-y divide-gray-700/50">
              {leaderboard.map((item) => (
                <tr key={item.userId} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-red-400">{item.rank}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full border-2 border-gray-600" src={item.publicAvatar} alt={`${item.publicName}'s avatar`} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-200">{item.publicName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-yellow-400 font-semibold">{item.score.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
