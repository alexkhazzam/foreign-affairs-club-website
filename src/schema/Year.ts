import mongoose from 'mongoose';

export default mongoose.model(
  'years',
  new mongoose.Schema({
    year: {
      type: String,
    },

    officers: {
      type: Array,
    },

    members: {
      type: Array,
    },
  })
);
