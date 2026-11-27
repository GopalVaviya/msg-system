const { Tenant: TenantModel } = require("../../../sequelize-client");

const create = async (data) => {
  try {
    return await TenantModel.create(data);
  } catch (error) {
    console.log(`Error from tenant create service => `, error);
    throw error;
  }
}

module.exports = create;