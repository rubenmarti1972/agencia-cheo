export default {
  routes: [
    {
      method: 'GET',
      path: '/ticket/:ticketCode',
      handler: 'ticket.findByCode',
      config: {
        auth: false,
      },
    },
  ],
};
