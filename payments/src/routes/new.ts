import express , { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@jk2b/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';

const router = express.Router();

router.post('/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (! order ) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id ) {
      throw new NotAuthorizedError('You are not the owner of this order');
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('This order is cancelled, no payment can be accepted');
    }

    const charge = await stripe.charges.create({
      currency: 'eur',
      amount: order.price * 100,
      source: token
    });

    const payment = Payment.build({
      stripeId : charge.id,
      orderId : orderId
    })
    await payment.save();

    res.status(201).send({success: true});

  });

  export {router as createChargeRouter};

