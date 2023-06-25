import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';
import { errorHandler, NotFoundError, currentuser } from '@jk2b/common';

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
app.use(currentuser);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
