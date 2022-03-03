import mongoose from 'mongoose';

export default mongoose.model(
  'pings',
  new mongoose.Schema({
    totalPings: {
      type: Number,
    },
  })
);
