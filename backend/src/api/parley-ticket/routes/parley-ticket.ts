export default {
  routes: [
    {
      method: 'POST',
      path: '/parley/place-ticket',
      handler: 'parley-ticket.placeTicket',
      info: {
        contentType: 'api::parley-ticket.parley-ticket',
      },
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
