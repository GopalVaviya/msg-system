const { Message: MessageModel } = require("../../../sequelize-client");

const getOne = async (messageId, tenantId) => {
  try {
    return await MessageModel.findOne({
      where: { id: messageId, tenantId },
      attributes: [
        'id',
        'conversationId',
        'to',
        'text',
        'status',
        'sentAt',
        'deliveredAt',
        'readAt',
        'failedAt'
      ]
    });
  } catch (error) {
    console.log(`Error from message get one service => `, error);
    throw error;
  }
}

module.exports = getOne;
