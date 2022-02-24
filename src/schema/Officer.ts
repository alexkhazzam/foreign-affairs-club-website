import mongoose from 'mongoose';

export default mongoose.model(
  'officers',
  new mongoose.Schema({
    email: {
      type: String,
    },

    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    password: {
      type: String,
    },

    adminAccess: {
      type: String,
    },
  })
);
