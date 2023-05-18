import {connect, StringCodec} from "nats";

console.clear();

const sc = StringCodec();

const servers = process.env.NATS_URL || "nats://localhost:14222";

const nc =  async () => {
  const nc = await connect({
    servers: servers.split(","),
    name: 'qg2-connection',
  })
  
  let sub = nc.subscribe("ticket:created", {
    queue: 'queue-group1',
  });


  const done = (async () => {
    for await (const msg of sub) {
      console.log(`${sc.decode(msg.data)} on subject ${msg.subject}`);
    }
  })()

  await done;
  await nc.drain();

  return nc;
} 

nc();

