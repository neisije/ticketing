import mongoose  from 'mongoose';
import { DatabaseConnectionError } from '@jk2b/common';
import { app } from './app';

const start = async () => {
  console.log('Starting up...');
  
  if ( ! process.env.JWT_KEY ) {
    console.error('Env variable JWT_KEY must be defined !');
    throw new Error('Env variable JWT_KEY must be defined !')
  }

  if ( ! process.env.MONGODB_URL ) {
    console.error('Env variable MONGODB_URL must be defined !');
    throw new Error('Env variable MONGODB_URL must be defined !')
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected to mongodb ${process.env.MONGODB_URL}`);
  } catch (err) {
    console.error(err);
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
}

start();



