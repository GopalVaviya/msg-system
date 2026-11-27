const { Router } = require('express');
const create = require('./controller/create.controller');

const route = Router()

route.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', module: 'webhook' })
})

route.post('/provider', create)

module.exports = route
