// src/config/middlewares.js

module.exports = [
  // ...
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000', 'http://192.168.0.108:3000'], // разреши тут свои домены
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      headers: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  },
  // ...
];
