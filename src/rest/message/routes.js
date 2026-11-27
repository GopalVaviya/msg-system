const { Router } = require('express');
const create = require('./controller/create.controller');
const getOne = require('./controller/get-one.controller');
const getConversationMessages = require('./controller/get-conversation-messages.controller');
const validateTenantHeader = require('../../middleware/validate-tenant.middleware');

const route = Router()

route.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', module: 'message' })
})

route.get('/conversation/:conversationId', validateTenantHeader, getConversationMessages)
route.get('/:messageId', validateTenantHeader, getOne)
route.post('/create', create)

module.exports = route
