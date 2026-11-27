const { isEmpty } = require('lodash');

const webhookServices = require('../services');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_STATUSES = ['SENT', 'DELIVERED', 'READ', 'FAILED'];

const create = async (req, res) => {
  try {
    const { eventId, messageId, status, occurredAt } = req.body || {};

    if (isEmpty(eventId) || typeof eventId !== 'string' || !eventId.trim()) {
      return res.status(400).json({ success: false, message: 'eventId must be required' })
    }

    if (isEmpty(messageId) || typeof messageId !== 'string' || !UUID_REGEX.test(messageId.trim())) {
      return res.status(400).json({ success: false, message: 'messageId must be a valid UUID' })
    }

    if (isEmpty(status) || typeof status !== 'string' || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `status must be one of: ${ALLOWED_STATUSES.join(', ')}` })
    }

    if (isEmpty(occurredAt) || typeof occurredAt !== 'string' || !occurredAt.trim()) {
      return res.status(400).json({ success: false, message: 'occurredAt must be required' })
    }

    const occurredAtDate = new Date(occurredAt.trim());

    if (Number.isNaN(occurredAtDate.getTime())) {
      return res.status(400).json({ success: false, message: 'occurredAt must be a valid date' })
    }

    const result = await webhookServices.create({
      eventId: eventId.trim(),
      messageId: messageId.trim(),
      status,
      occurredAt: occurredAtDate
    });

    return res.status(200).json({
      success: true,
      duplicate: result.duplicate,
      data: {
        eventId: result.event.eventId,
        messageId: result.event.messageId,
        eventStatus: result.event.status,
        occurredAt: result.event.occurredAt,
        processingResult: result.event.processingResult,
        messageStatus: result.message ? result.message.status : null,
        processed: result.processed
      }
    })
  } catch (error) {
    console.log(`Error from webhook create controller => `, error)

    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: status === 500 ? 'something went wrong' : error.message
    })
  }
}

module.exports = create;
