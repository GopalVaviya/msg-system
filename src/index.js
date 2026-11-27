const express = require('express');

const { PORT } = require('./env-config/config');
const db = require('./sequelize-client');

const tenantRoutes = require('./rest/tenant/routes');
const messageRoutes = require('./rest/message/routes');
const webhookRoutes = require('./rest/webhook/routes');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1/tenant', tenantRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/webhooks', webhookRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'route not found' });
});

app.use((error, req, res, next) => {
  console.log(`Error from middleware => `, error);
  res.status(error.status || 500).json({
    message: error.message || 'something went wrong'
  });
});

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ force: false });

    app.listen(PORT, () => {
      console.log(`server is running on port: ${PORT}`)
    });
  } catch (error) {
    console.log(`Error from startServer => `, error);
    process.exit(1);
  }
}

startServer();
