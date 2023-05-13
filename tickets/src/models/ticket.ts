import mongoose from "mongoose";

// Interface that describes the properties required to create a new ticket
interface ticketAttrs {
  title: string;
  price: number;
  userId: string;
}

// Interface that describes the properties that a ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: ticketAttrs) : TicketDoc;
}

// Interface that describes the properties that the ticket document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price : number;
  userId : number;
}

export class TicketClass implements ticketAttrs {
  public title: string = '';
  public price: number = 0;
  public userId: string = '';

}

const ticketSchema = new mongoose.Schema ({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }}, {
    toJSON : {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false
    }
});


ticketSchema.statics.build = ( attrs : ticketAttrs) => {
  return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);


export {Ticket};
