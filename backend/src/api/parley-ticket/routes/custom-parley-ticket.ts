export default {
  routes: [
    {
      method: 'POST',
      path: '/parley/place-ticket',
      handler: 'api::parley-ticket.parley-ticket.placeTicket',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
