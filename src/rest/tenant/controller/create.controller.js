const { isEmpty } = require('lodash');
const tenantServices = require('../services');

const create = async (req, res) => {
  try {
    const { name } = req.body;

    if (isEmpty(name) || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'name must be required' })
    }

    const tenant = await tenantServices.create({ name: name.trim() })
    return res.status(201).json({ message: 'tenant created successfully', data: tenant })
  } catch (error) {
    console.log(`Error from tenant create controller => `, error)
    return res.status(500).json({ message: 'something went wrong' })
  }
}

module.exports = create;
