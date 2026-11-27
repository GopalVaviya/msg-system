const { Message: MessageModel, Tenant: TenantModel } = require("../../../sequelize-client");

const getConversationMessages = async ({ tenantId, conversationId, limit, skip }) => {
  try {
    const tenant = await TenantModel.findByPk(tenantId, {
      attributes: ['id']
    });

    if (!tenant) {
      const error = new Error('tenant not found');
      error.status = 404;
      throw error;
    }

    const messages = await MessageModel.findAll({
      attributes: ['id', 'conversationId', 'text', 'status'],
      where: {
        tenantId,
        conversationId
      },
      order: [['createdAt', 'ASC'], ['id', 'ASC']],
      offset: skip,
      limit
    });

    return {
      data: messages.map(({ id, conversationId, text, status }) => ({
        id,
        conversationId,
        text,
        status
      }))
    };
  } catch (error) {
    console.log(`Error from message get conversation messages service => `, error);
    throw error;
  }
}

module.exports = getConversationMessages;
