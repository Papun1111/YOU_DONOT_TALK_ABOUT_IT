import mongoose from 'mongoose';
import { Room } from './api/models/Room.model';
import { Challenge } from './api/models/Challenge.model';
import { MONGO_URI } from './config';
import * as Logger from './utils/logger';

const roomsData = [
  {
    key: 'the-basement',
    name: 'The Basement',
    description: 'A place for the logical and the quick-witted. Solve timed brain teasers and logic puzzles to prove your mettle.',
    rules: ['Speed and accuracy are rewarded.', 'No collaboration.'],
    weights: { puzzle: 1.2, dare: 0, upvote: 0.5 },
  },
  {
    key: 'support-groups',
    name: 'Support Groups',
    description: 'A space for anonymous expression. Respond to writing dares and react to the thoughts of your peers.',
    rules: ['All posts are anonymous.', 'React with wit and boldness.', 'No downvotes.'],
    weights: { puzzle: 0, dare: 1.0, upvote: 1.5 },
  },
  {
    key: 'project-mayhem',
    name: 'Project Mayhem (Safe)',
    description: 'For those who see the patterns in the noise. Engage in ARG-style puzzle chains and uncover hidden clues.',
    rules: ['Think outside the box.', 'Clues are strictly in-app.', 'Some puzzles may require information from other rooms.'],
    weights: { puzzle: 1.5, dare: 0.8, upvote: 1.0 },
  },
];

const seedDatabase = async () => {
  Logger.info('Connecting to the database for seeding...', 'Seed');
  try {
    await mongoose.connect(MONGO_URI);
    Logger.info('Database connected. Clearing existing data...', 'Seed');

    // 1. Clear previous data to ensure a fresh start
    await Room.deleteMany({});
    await Challenge.deleteMany({});
    Logger.info('Existing rooms and challenges cleared. Seeding new data...', 'Seed');

    // 2. Create rooms and get their newly generated database IDs
    const createdRooms = await Room.insertMany(roomsData);
    const basementRoom = createdRooms.find(r => r.key === 'the-basement');
    const supportRoom = createdRooms.find(r => r.key === 'support-groups');
    Logger.info(`Seeded ${createdRooms.length} rooms.`);

    // 3. Create challenges and link them to the new rooms using their IDs
    if (basementRoom && supportRoom) {
      const challengesData = [
        {
          roomId: basementRoom._id,
          type: 'puzzle',
          title: 'The Riddle of the Eye',
          prompt: 'I have an eye, but I am blind. I am sharp, but have no mind. What am I?',
          options: ['A Storm', 'A Needle', 'A Potato', 'A Camera'],
          correctIndex: 1,
          difficulty: 2,
          active: true,
        },
        {
          roomId: supportRoom._id,
          type: 'dare',
          title: 'A Minor Confession',
          prompt: 'Describe a time you got away with something trivial.',
          difficulty: 3,
          active: true,
        },
         {
          roomId: basementRoom._id,
          type: 'puzzle',
          title: 'Forward I am Heavy',
          prompt: 'Forward I am heavy, but backward I am not. What am I?',
          options: ['A Scale', 'A Ton', 'A Shadow', 'An Anchor'],
          correctIndex: 1,
          difficulty: 3,
          active: true,
        },
      ];
      await Challenge.insertMany(challengesData);
      Logger.info(`Seeded ${challengesData.length} challenges.`);
    }

    Logger.info('✅ Database seeded successfully!', 'Seed');
  } catch (error) {
    Logger.error('An error occurred during database seeding.', error, 'Seed');
  } finally {
    // 4. Always disconnect from the database when the script is done
    await mongoose.disconnect();
    Logger.info('Database connection closed.', 'Seed');
  }
};

// Execute the function to run the seed script
seedDatabase();

