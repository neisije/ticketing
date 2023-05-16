import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';
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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
