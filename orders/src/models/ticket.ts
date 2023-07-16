import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  title: string;
  price: number;
};

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<Boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs : TicketAttrs) : TicketDoc;

}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },{
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

ticketSchema.statics.build = (attrs : TicketAttrs) => {
  return new Ticket(attrs);
}

ticketSchema.methods.isReserved = async function () {
  // this is equal to the ticket document we just called 'isReserved' on

  // run query to look at all orders, and find an order where the ticket is we just fetch
  // *and* the order status is *not* cancelled
  // If we find an order from that means that the ticket is reserved

  // const existingOrder = await Order.findOne({
  //   ticket: this,
  //   status: {
  //     $in: [
  //       OrderStatus.Created,
  //       OrderStatus.Complete,
  //       OrderStatus.AwaitingPayment,
  //      ]
  //    }
  //   }
  // )

  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $ne: OrderStatus.Cancelled
      }
    }
  )
  return !!existingOrder;

}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket};
