import mongoose from 'mongoose';
import { DatabaseConnectionError } from '@jk2b/common';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    console.error('Env variable JWT_KEY must be defined !');
    throw new Error('Env variable JWT_KEY must be defined !');
  }

  if (!process.env.MONGODB_URL) {
    console.error('Env variable MONGODB_URL must be defined !');
    throw new Error('Env variable MONGODB_URL must be defined !');
  }

  if (!process.env.NATS_URL) {
    console.error('Env variable NATS_URL must be defined !');
    throw new Error('Env variable NATS_URL must be defined !');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    console.error('Env variable NATS_CLUSTER_ID must be defined !');
    throw new Error('Env variable NATS_CLUSTER_ID must be defined !');
  }

  if (!process.env.NATS_CLIENT_ID) {
    console.error('Env variable NATS_CLIENT_ID must be defined !');
    throw new Error('Env variable NATS_CLIENT_ID must be defined !');
  }

  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID , process.env.NATS_URL);
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT', () => {
      natsWrapper.client.close();
    });
    
    process.on('SIGTERM', () => {
      natsWrapper.client.close();
    });

    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected to mongodb ${process.env.MONGODB_URL}`);

  } catch (err) {
    console.error(err);
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
