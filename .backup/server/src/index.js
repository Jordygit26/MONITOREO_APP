const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/app.config');
const nodeRoutes = require('./routes/nodeRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors(config.cors));
app.use(express.json()); // Body parser para el POST de ping
app.use(morgan('dev')); // Logging HTTP

// Rutas de API
app.use('/api/v1/nodes', nodeRoutes);

// Ruta de healthcheck básica
app.get('/', (req, res) => {
  res.status(200).json({ status: 'WMS-Lite API Running' });
});

// Middleware de manejo de errores (siempre al final)
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 [Server] WMS-Lite API corriendo en puerto ${PORT}`);
});
