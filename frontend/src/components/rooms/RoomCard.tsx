import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {type Room } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import GlitchHeading from '../ui/GlitchHeading';
import { ArrowRight } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

/**
 * A card component that displays information about a single room
 * and provides a link to enter it.
 */
const RoomCard = ({ room }: RoomCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="flex flex-col h-full">
        <GlitchHeading as="h2" text={room.name} className="text-2xl text-red-400 mb-2" />
        <p className="text-gray-400 text-sm mb-4 flex-grow">{room.description}</p>
        <div className="mt-auto">
          <Link to={`/rooms/${room.key}`}>
            <Button className="w-full">
              Enter <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default RoomCard;
