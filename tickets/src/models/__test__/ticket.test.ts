import { Ticket } from "../ticket";


const createTicket = async () => {

}

it('implement optimistic update', async () => {

  // Create a Ticket to the DB
  const ticket = Ticket.build({
    title: "Concert",
    price: 10,
    userId: '123'
  });
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);

  const secondInstance = await Ticket.findById(ticket.id);
  // Make 2 separate changes to the ticket we fetched
  firstInstance!.set({price: 20});
  secondInstance!.set({price: 30});

  // save the first fetched ticket (should be OK)
  await firstInstance!.save();
  const thirdInstance = await Ticket.findById(ticket.id);

  // save the second fetched ticket (should be NOK as our local version is now outdated)
  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    // return;
  }

  expect(thirdInstance!.version).toEqual(1);
  thirdInstance!.set({price: 40});
  await thirdInstance!.save();

  const forthInstance = await Ticket.findById(ticket.id);
  expect(forthInstance!.version).toEqual(2);
  expect(forthInstance!.price).toEqual(40);

})