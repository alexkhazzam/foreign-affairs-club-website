import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

(async () => {
  (await mongoose.connect(process.env.MONGO_DB_URI!)).connection.getClient();
})();

const app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));

export default app;
