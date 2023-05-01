import { Request, Response, NextFunction } from "express";

import jwt from 'jsonwebtoken';

interface UserPayload {
  id : string;
  email : string;
}

declare global {
  namespace Express{
    interface Request {
      currentUser? : UserPayload
    }
  }
}
export const currentuser = (req: Request, res: Response, next : NextFunction) => {

  if ( ! req.session?.jwt ) {
    return next();
  }

  try {
    const payload = jwt.verify(req.session?.jwt,process.env.JWT_KEY!) as UserPayload;
    // Request type was augmented by the declare statement above...
    // This will allow to store a new property currentuser of type UserPayload in the Request
    req.currentUser = payload;
  } catch (err) {
    // whatever the error we want to call nextFunction()
  }

  next();

};
