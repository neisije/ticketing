import express, { Request, Response } from "express";
import { requireAuth } from '@jk2b/common'; 
import { body } from "express-validator";
import { validateRequest } from '@jk2b/common';
import { Ticket } from "../models/ticket";
// import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  "/api/tickets",
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
      const { title, price } = req.body;
      const ticket = Ticket.build({title, price, userId: req.currentUser!.id});
      await ticket.save();
      
      res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
