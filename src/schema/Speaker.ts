import mongoose from 'mongoose';

export default mongoose.model(
  'speakers',
  new mongoose.Schema({
    date: {
      type: String,
    },
    name: {
      type: String,
    },

    description: {
      type: String,
    },
  })
);
