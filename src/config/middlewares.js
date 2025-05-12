// src/config/middlewares.js

module.exports = {
  config: {
    cors: {
      enabled: true,
      origin: ['http://192.168.0.108:3000'], // замени на свой адрес фронтенда
      headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
    },
  },
}
