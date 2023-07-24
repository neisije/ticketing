import { Message , Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class listener<T extends Event> {
  abstract subject: T['subject'];
  abstract onMessage(data: T['data'], msg: Message) : void;
  abstract queueGroupName: string;
  protected ackWait : number = 5 * 1000;
  private client : Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
      const options = this.subscriptionOptions()
      const subscription = this.client.subscribe(
        this.subject, 
        this.queueGroupName, 
        this.subscriptionOptions()
      );

      subscription.on('message', (msg: Message) => {
        // console.log(`Message Received: ${this.subject} / ${this.queueGroupName}`);

        const parsedData = this.parseMessage(msg);

        this.onMessage(parsedData, msg);
      });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof(data) === 'string'
      ?   data
      :   JSON.parse(data.toString('utf8'));
  }

}
