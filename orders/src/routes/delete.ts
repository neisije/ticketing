import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus, requireAuth , validateRequest } from '@jk2b/common'; 
import { body } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.delete('/api/orders/:orderId', 
requireAuth,
async (req : Request,res: Response) => {

  const {orderId} = req.params ;

  const order = await Order.findById(orderId);
  if (! order) {
    throw new NotFoundError();
  }
  if (order.userId != req.currentUser!.id) {
    throw new NotAuthorizedError("You are not allowed delete an order you don't own");
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  // Publishing an event saying that this order is cancelled

  res.status(204).send(order);
});

export { router as deleteOrderRouter };