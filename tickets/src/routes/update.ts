import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from '@jk2b/common';
import { Ticket } from "../models/ticket";

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
      
      res.status(200).send(ticket);
    }
);

export { router as updateTicketRouter };
