import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@jk2b/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());

// secure set to false for jest tests
app.use(
  cookieSession({
    signed: false,
    secure: process.env.ENV_NODE !== 'test',
  })
);
app.use(currentUser);

app.use(createChargeRouter);


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
