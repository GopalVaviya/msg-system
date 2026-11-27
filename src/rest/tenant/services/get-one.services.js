const { Tenant: TenantModel } = require("../../../sequelize-client");

const getOne = async (tenantId) => {
  try {
    return await TenantModel.findByPk(tenantId, {
      attributes: ['id', 'name', 'createdAt', 'updatedAt']
    });
  } catch (error) {
    console.log(`Error from tenant get one service => `, error);
    throw error;
  }
}

module.exports = getOne;
