const tenantServices = require('../services');

const getAll = async (req, res) => {
  try {
    const tenants = await tenantServices.getAll();

    return res.status(200).json({ message: 'tenants fetched successfully', data: tenants })
  } catch (error) {
    console.log(`Error from tenant get all controller => `, error)
    return res.status(500).json({ message: 'something went wrong' })
  }
}

module.exports = getAll;
