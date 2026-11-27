const { randomUUID } = require('crypto');

const { Message: MessageModel, Tenant: TenantModel } = require("../../../sequelize-client");

const create = async (data) => {
  try {
    const tenant = await TenantModel.findByPk(data.tenantId, {
      attributes: ['id']
    });

    if (!tenant) {
      const error = new Error('tenant not found');
      error.status = 404;
      throw error;
    }

    const now = new Date();

    return await MessageModel.create({
      id: randomUUID(),
      tenantId: data.tenantId,
      conversationId: data.conversationId,
      to: data.to,
      text: data.text,
      status: 'QUEUED',
      createdAt: now,
      updatedAt: now
    });
  } catch (error) {
    console.log(`Error from message create service => `, error);
    throw error;
  }
}

module.exports = create;
