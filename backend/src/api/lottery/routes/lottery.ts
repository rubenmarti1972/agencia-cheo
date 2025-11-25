export default {
  routes: [
    {
      method: 'POST',
      path: '/loterias/place-bet',
      handler: 'api::lottery.lottery.placeBet',
      info: {
        // Opcional, pero permitido: esto NO rompe nada
        contentType: 'api::lottery.lottery',
      },
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
