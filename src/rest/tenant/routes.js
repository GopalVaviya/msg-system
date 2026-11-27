const { Router} = require('express');
const create = require('./controller/create.controller');
const getAll = require('./controller/get-all.controller');
const getOne = require('./controller/get-one.controller');

const route = Router()

route.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', module: 'tenant' })
})

route.get('/', getAll)
route.get('/:tenantId', getOne)
route.post('/create', create)

module.exports = route