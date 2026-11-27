const create = require("./create.services");

class WebhookServices {
  async create(data) {
    return create(data)
  }
}

const webhookServices = new WebhookServices();
module.exports = webhookServices;
