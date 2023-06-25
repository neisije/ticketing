import nats, { Stan } from 'node-nats-streaming';


class NatsWrapper {


  // the ? in _client? tells Typescript that this variable can be undefined for a certain amount of time
  // as we don't want to initialize a NATS client when we create an instance of NatsWrapper
  // but only when we'll call the connect() method
  private _client? : Stan ;

  get client() {
    if ( ! this._client) {
      throw new Error('Cannot access NATS client before connecting')
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId,clientId,{url});

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        console.error('Unable to connect to NATS', err);
        reject(err);
      });
    });
  }
}

export const natsWrapper =  new NatsWrapper();
