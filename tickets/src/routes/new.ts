// import express, { Request, Response } from "express";
// import { requireAuth , validateRequest } from '@jk2b/common'; 
// import { body } from "express-validator";
// import { TicketCreatedPublisher } from "../../events/publishers/ticket-created-publisher";
// import { natsWrapper } from "../nats-wrapper";
// import { Ticket } from "../models/ticket";

// const router = express.Router();

// router.post(
//   "/api/tickets",
//   requireAuth,
//   [
//     body("title")
//       .isString()
//       .not()
//       .isEmpty()
//       .withMessage("A title must be defined"),
//     body("price")
//       .isFloat({gt: 0})
//       .withMessage("You must supply a price > 0")
//   ], 
//   validateRequest,
//    async (req: Request, res: Response) => {
//       const { title, price } = req.body;
//       const ticket = Ticket.build({title, price, userId: req.currentUser!.id});
//       await ticket.save();

//       // await new TicketCreatedPublisher(natsWrapper.client).publish({
//       //   id: ticket.id,
//       //   price: ticket.price,
//       //   title: ticket.title,
//       //   userId: ticket.userId.toString()
//       // }); 
      
//       await new TicketCreatedPublisher(natsWrapper.client).publish({
//         id: ticket.id,
//         title: ticket.title,
//         price: ticket.price,
//         userId: ticket.userId,
//       });

//       res.status(201).send(ticket);
//     }
// );

// export { router as createTicketRouter };

import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@jk2b/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
