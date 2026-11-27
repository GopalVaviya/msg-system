const create = require("./create.services");
const getAll = require("./get-all.services");
const getOne = require("./get-one.services");

class TenantServices {
  async create(data) {
    return create(data)
  }

  async getAll() {
    return getAll()
  }

  async getOne(tenantId) {
    return getOne(tenantId)
  }
}

const tenantServices = new TenantServices();
module.exports = tenantServices;