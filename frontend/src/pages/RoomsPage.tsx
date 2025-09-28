import { useState, useEffect,type FormEvent } from 'react';
import { type Room } from '../types';
import { getRooms,createRoom } from '../api/room';
import GlitchHeading from '../components/ui/GlitchHeading';
import Spinner from '../components/ui/Spinner';
import RoomCard from '../components/rooms/RoomCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { PlusCircle } from 'lucide-react';

/**
 * Page that displays the list of available rooms and allows users to create new ones.
 */
const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for managing the "Create Room" modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all rooms when the component first loads
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Could not load rooms.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for submitting the new room form
  const handleCreateRoom = async (e: FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    try {
        // Call the API function from the Canvas
        const newRoom = await createRoom(newRoomName, newRoomDesc);
        // Add the new room to the top of the list for immediate feedback
        setRooms(prevRooms => [newRoom, ...prevRooms]);
        // Close the modal and reset the form
        setIsModalOpen(false);
        setNewRoomName('');
        setNewRoomDesc('');
    } catch (apiError) {
        const errorMessage = apiError instanceof Error ? apiError.message : 'Failed to create room.';
        setError(errorMessage);
        // Keep the modal open so the user can see the error
    } finally {
        setIsCreating(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

  return (
    <div>
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8 text-center">
        <GlitchHeading text="Choose Your Arena" as="h1" className="text-3xl" />
        <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Room
        </Button>
      </div>

      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      ) : (
        !error && (
            <div className="text-center py-12 text-gray-500">
                <p>No rooms have been created yet.</p>
                <p className="text-sm">Be the first to define a new space.</p>
            </div>
        )
      )}
      
      {/* Display general page errors here */}
      {error && !isModalOpen && <p className="text-center text-yellow-400 mt-4 bg-yellow-900/50 p-2 rounded">{error}</p>}

      {/* The Modal for Creating a New Room */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Define a New Space">
        <form onSubmit={handleCreateRoom} className="space-y-4">
            {error && isModalOpen && <p className="text-center text-yellow-400 mb-4 bg-yellow-900/50 p-2 rounded">{error}</p>}
            <div>
                <label htmlFor="roomName" className="block text-sm font-medium text-gray-300 mb-1">Room Name</label>
                <Input id="roomName" value={newRoomName} onChange={e => setNewRoomName(e.target.value)} placeholder="e.g., The Echo Chamber" required disabled={isCreating}/>
            </div>
            <div>
                <label htmlFor="roomDesc" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea id="roomDesc" value={newRoomDesc} onChange={e => setNewRoomDesc(e.target.value)} rows={3} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50" placeholder="A short description of your room's purpose." required disabled={isCreating}/>
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isCreating}>Cancel</Button>
                <Button type="submit" isLoading={isCreating}>Create</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomsPage;

