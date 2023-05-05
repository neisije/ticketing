import { MongoMemoryServer  } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import {UserClass}   from '../models/user';

declare global {
  var signin: () => Promise<string[]>;

  var testUser : UserClass;

}

global.testUser = {
  email : 'test@test.com',
  password : '01azAZ?;,Az33'
};


// declare global {
//   namespace NodeJS {
//     export interface Global {
//       signin(): Promise<string[]>;
//     }
//   }
// }

let mongo: any ;

beforeAll(async () => {

  process.env.JWT_KEY = 'abcd';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});


beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});


global.signin = async () => {

  const response = await request(app)
    .post('/api/users/signup')
    .send(testUser)
    .expect(201);

    const cookie = response.get("Set-Cookie");

    return cookie;

};
