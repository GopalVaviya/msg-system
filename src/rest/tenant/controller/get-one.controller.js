const tenantServices = require('../services');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getOne = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!UUID_REGEX.test(tenantId)) {
      return res.status(400).json({ message: 'invalid tenant id' })
    }

    const tenant = await tenantServices.getOne(tenantId);

    if (!tenant) {
      return res.status(404).json({ message: 'tenant not found' })
    }

    return res.status(200).json({ message: 'tenant fetched successfully', data: tenant })
  } catch (error) {
    console.log(`Error from tenant get one controller => `, error)
    return res.status(500).json({ message: 'something went wrong' })
  }
}

module.exports = getOne;
