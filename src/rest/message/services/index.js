const create = require("./create.services");
const getOne = require("./get-one.services");
const getConversationMessages = require("./get-conversation-messages.services");

class MessageServices {
  async create(data) {
    return create(data)
  }

  async getOne(messageId, tenantId) {
    return getOne(messageId, tenantId)
  }

  async getConversationMessages(params) {
    return getConversationMessages(params)
  }
}

const messageServices = new MessageServices();
module.exports = messageServices;