const config = {
  port: process.env.PORT || 3001,
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  thresholds: {
    signal: {
      excellent: -60,
      acceptable: -80
    }
  }
};

module.exports = config;
