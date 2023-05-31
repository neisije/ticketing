import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from '@jk2b/common';
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";


// import jwt from 'jsonwebtoken';

const router = express.Router();

router.put(
  "/api/ticket/:id",
  requireAuth,
  [
    body("title")
      .isString()
      .not()
      .isEmpty()
      .withMessage("A title must be defined"),
    body("price")
      .isFloat({gt: 0})
      .withMessage("You must supply a price > 0")
  ], 
  validateRequest,
    async (req: Request, res: Response) => {
      const ticket = await Ticket.findById(req.params.id);
      if (! ticket ) {
        throw new NotFoundError();
      } 

      if (ticket.userId.toString() !== req.currentUser!.id ) {
        throw new NotAuthorizedError('You are not allowed to update tickets you do not own');
      }
      const { title, price } = req.body;

      ticket.set({
        title: title,
        price: price
      });
      
      await ticket.save();
      
      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId.toString()
      });  

      console.log(`Ticket ${ticket.id} updated : Ticket's price is now ${ticket.price} !!!`);

      res.status(200).send(ticket);
    }
);

export { router as updateTicketRouter };
