const { Tenant: TenantModel } = require("../../../sequelize-client");

const getAll = async () => {
  try {
    return await TenantModel.findAll({
      attributes: ['id', 'name', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });
  } catch (error) {
    console.log(`Error from tenant get all service => `, error);
    throw error;
  }
}

module.exports = getAll;
