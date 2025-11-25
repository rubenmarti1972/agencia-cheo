export default {
  routes: [
    {
      method: 'GET',
      path: '/ticket/:ticketCode',
      handler: 'ticket.findByCode',
      info: {
        contentType: 'api::lottery-bet.lottery-bet',
      },
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};

