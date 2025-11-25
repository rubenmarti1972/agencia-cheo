export default {
  routes: [
    {
      method: 'POST',
      path: '/parley/place-ticket',
      handler: 'parley-ticket.placeTicket',
      config: {
        auth: false,
      },
    },
  ],
};
