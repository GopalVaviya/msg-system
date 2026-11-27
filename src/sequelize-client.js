const { Sequelize, DataTypes } = require('sequelize');

const { DATABASE } = require('./env-config/config');
const tenant = require('./schema/tenant.model')
const message = require('./schema/message.model')
const webhookEvent = require('./schema/webhook-event.model')

const sequelize = new Sequelize(DATABASE.NAME, DATABASE.USERNAME, DATABASE.PASSWORD, {
  host: DATABASE.HOST,
  dialect: DATABASE.DIALECT,
  logging: false,
});

const Tenant = tenant(sequelize, DataTypes);
const Message = message(sequelize, DataTypes);
const WebhookEvent = webhookEvent(sequelize, DataTypes);

const db = { sequelize, Tenant, Message, WebhookEvent };

module.exports = db;
