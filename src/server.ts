import path from 'path';
import dotenv from 'dotenv';
import app from './app';

dotenv.config({ path: path.join(__dirname, '../config.env') });

const PORT: number = parseInt(process.env.PORT!) || 5000;

app.listen(PORT, (): void =>
  console.log(`Listening to requests on port ${PORT}`)
);
