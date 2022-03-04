import mongoose from 'mongoose';

export default mongoose.model(
  'resource',
  new mongoose.Schema({
    title: {
      type: String,
    },

    type: {
      type: String,
    },

    link: {
      type: String,
    },

    date: {
      type: String,
    },
  })
);
