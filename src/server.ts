import path from 'path';
import dotenv from 'dotenv';
import app from './app';

dotenv.config({ path: path.join(__dirname, '../config.env') });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening to requests on port ${PORT}`));
