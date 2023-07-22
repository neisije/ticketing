import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError, OrderStatus, requireAuth , validateRequest } from '@jk2b/common'; 
import { body } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

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

  const { ticketId } = req.body;

  // find the ticket the user is trying to order in the database
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  // Make sure that this ticket is not already reserved


  const isReserved = await ticket.isReserved();

  if (isReserved) {
    throw new BadRequestError("Ticket is already reserved");
  }

  // Calculate an expiration date for this order
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  // Build the order and save it to the DB
  const order =  Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt : expiration,
    ticket
  });
  
  await order.save();

  // Publish an event saying that an order was created
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    version: order.version,
    expiresAt : order.expiresAt.toISOString(),
    ticket : {
      id: ticket.id,
      price: ticket.price
    }
  });

  res.status(201).send(order);
});

export { router as createOrderRouter };