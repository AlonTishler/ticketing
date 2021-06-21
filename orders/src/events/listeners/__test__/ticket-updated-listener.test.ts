import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@amttickets/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  //create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //create and save a ticket

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  //create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'fgaeg',
  };

  //create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  //return all
  return { msg, data, ticket, listener };
};

it('finds, updates and saves a ticket', async () => {
  const { msg, data, ticket, listener } = await setup();
  //call the onMessage function with the data object + message object

  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was Updated

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();

  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ack functions was called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not ack the message if version number is > ', async () => {
  const { msg, data, listener } = await setup();

  data.version = 10;

  //call the onMessage function with the data object + message object and write assertions to make sure a ack functions was called
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
