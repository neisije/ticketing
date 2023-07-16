import express, { Request, Response } from "express";

import mongoose from "mongoose";
import { BadRequestError, NotFoundError, OrderStatus, requireAuth , validateRequest } from '@jk2b/common'; 
import { body } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";


const router = express.Router();

router.get('/api/orders', 
requireAuth,
async (req : Request,res: Response) => {

  const orders = await Order.find({
    userId : req.currentUser!.id
  }).populate('ticket');

  res.status(200).send(orders);
});

export { router as indexOrderRouter };