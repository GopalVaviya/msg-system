const { randomUUID } = require('crypto');

const {
  sequelize,
  Message: MessageModel,
  WebhookEvent: WebhookEventModel
} = require("../../../sequelize-client");

const STATUS_RANK = {
  QUEUED: 0,
  SENT: 1,
  DELIVERED: 2,
  READ: 3,
  FAILED: 3
};

const TIMESTAMP_FIELD = {
  SENT: 'sentAt',
  DELIVERED: 'deliveredAt',
  READ: 'readAt',
  FAILED: 'failedAt'
};

const create = async (data) => {
  try {
    return await sequelize.transaction(async (transaction) => {
      const existingEvent = await WebhookEventModel.findOne({
        where: { eventId: data.eventId },
        transaction
      });

      if (existingEvent) {
        return {
          duplicate: true,
          processed: false,
          event: existingEvent,
          message: null
        };
      }

      const message = await MessageModel.findByPk(data.messageId, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!message) {
        const error = new Error('message not found');
        error.status = 404;
        throw error;
      }

      const currentRank = STATUS_RANK[message.status] ?? -1;
      const incomingRank = STATUS_RANK[data.status] ?? -1;
      const shouldUpdate = incomingRank > currentRank;

      if (shouldUpdate) {
        await message.update({
          status: data.status,
          [TIMESTAMP_FIELD[data.status]]: data.occurredAt,
          updatedAt: new Date()
        }, { transaction });
      }

      const event = await WebhookEventModel.create({
        id: randomUUID(),
        eventId: data.eventId,
        messageId: data.messageId,
        status: data.status,
        occurredAt: data.occurredAt,
        processedAt: new Date(),
        processingResult: shouldUpdate ? 'PROCESSED' : 'IGNORED_STATUS'
      }, { transaction });

      return {
        duplicate: false,
        processed: shouldUpdate,
        event,
        message: shouldUpdate ? message : null
      };
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const existingEvent = await WebhookEventModel.findOne({
        where: { eventId: data.eventId }
      });

      if (existingEvent) {
        console.log(`Duplicate webhook event ignored => `, data.eventId);
        return {
          duplicate: true,
          processed: false,
          event: existingEvent,
          message: null
        };
      }
    }

    console.log(`Error from webhook create service => `, error);
    throw error;
  }
}

module.exports = create;
