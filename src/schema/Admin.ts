import mongoose from 'mongoose';

export default mongoose.model(
  'admins',
  new mongoose.Schema({
    email: {
      type: String,
    },
  })
);
