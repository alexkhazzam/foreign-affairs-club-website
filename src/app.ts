import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import routes from './routes';

dotenv.config({ path: path.join(__dirname, '../.env') });

const client = mongoose
  .connect(process.env.MONGO_DB_URI!)
  .then(mongoClient => mongoClient.connection.getClient());

const app = express();

// app.use(
//   session({
//     secret: process.env.CLIENT_SECRET!,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       clientPromise: client,
//       stringify: false,
//       autoRemove: 'interval',
//       autoRemoveInterval: 1,
//       ttl: 1 * 24 * 60 * 60,
//     }),
//   })
// );

// add

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

export default app;
