import {connect, StringCodec} from "nats";

console.clear();

const sc = StringCodec();

const servers = process.env.NATS_URL || "nats://localhost:14222";

const nc =  async () => {
  const nc = await connect({
    servers: servers.split(","),
  })

  const jsm = nc.jetstreamManager();
  const js = nc.jetstream();

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 10,
  });
  
  js.publish("ticket_created", sc.encode(data));
  // console.log('event published');

  return nc;
} 

nc();

