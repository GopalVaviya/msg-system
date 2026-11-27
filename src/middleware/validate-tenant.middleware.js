const { isEmpty } = require('lodash');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateTenantHeader = (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];

  if (isEmpty(tenantId) || typeof tenantId !== 'string' || !UUID_REGEX.test(tenantId.trim())) {
    return res.status(400).json({ success: false, message: 'x-tenant-id must be a valid UUID' })
  }

  req.tenantId = tenantId.trim();
  return next();
}

module.exports = validateTenantHeader;
