import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { requireAuth , validateRequest } from '@jk2b/common'; 
import { body } from "express-validator";

const router = express.Router();

router.post('/api/orders', 
requireAuth,
[
  body("ticketId")
    .isString()
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("A valid ticket ID must be provided")
], 
validateRequest,
async (req : Request,res: Response) => {

  res.status(200).send({});
});

export { router as createOrderRouter };