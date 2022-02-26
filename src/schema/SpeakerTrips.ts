import mongoose from 'mongoose';

export default mongoose.model(
  'speakers-trips',
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

    type: {
      type: String,
    },
  })
);
