export default {
  contentType: 'api::lottery-bet.lottery-bet',
  routes: [
    {
      method: 'GET',
      path: '/ticket/:ticketCode',
      handler: 'api::ticket.ticket.findByCode',
      info: {
        contentType: 'api::lottery-bet.lottery-bet',
      },
      config: {
        auth: false,
      },
    },
  ],
};
