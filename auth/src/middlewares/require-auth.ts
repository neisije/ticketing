import { Request, Response, NextFunction } from "express";

import { NotAuthorizedError } from "../errors/not-authorized-error";

// export const currentuser = (req: Request, res: Response, next : NextFunction) => {


export const requireAuth = (req : Request, res: Response, next : NextFunction) => {

  if (! req.currentUser ) {
    throw new NotAuthorizedError('Not allowed to access this URI');
  };

  next();
};