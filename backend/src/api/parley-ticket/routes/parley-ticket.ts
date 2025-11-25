export default {
  contentType: 'api::parley-ticket.parley-ticket',
  routes: [
    {
      method: 'POST',
      path: '/parley/place-ticket',
      handler: 'api::parley-ticket.parley-ticket.placeTicket',
      info: {
        contentType: 'api::parley-ticket.parley-ticket',
      },
      config: {
        auth: false,
      },
    },
  ],
};
