import express, { Request, Response } from "express";

import mongoose from "mongoose";
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth , validateRequest } from '@jk2b/common'; 
import { body } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get('/api/orders/:orderId', 
requireAuth,
async (req : Request,res: Response) => {

  // const order = await Order.find({
  //   userId : req.currentUser!.id,
  //   id: req.params.orderId
  // }).populate('ticket');

  const order = await Order.findById(req.params.orderId).populate('ticket');

  if (! order) {
    throw new NotFoundError();
  }
  if (order.userId != req.currentUser!.id) {
    throw new NotAuthorizedError("You are not allowed to list orders you don't own");
  }

  res.status(200).send(order);
});

export { router as showOrderRouter };
