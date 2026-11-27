const { isEmpty } = require('lodash');

const messageServices = require('../services');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getOne = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (isEmpty(messageId) || typeof messageId !== 'string' || !UUID_REGEX.test(messageId.trim())) {
      return res.status(400).json({ success: false, message: 'messageId must be a valid UUID' })
    }

    const message = await messageServices.getOne(messageId.trim(), req.tenantId);

    if (!message) {
      return res.status(404).json({ success: false, message: 'message not found' })
    }

    return res.status(200).json({
      success: true,
      data: {
        id: message.id,
        conversationId: message.conversationId,
        to: message.to,
        text: message.text,
        status: message.status,
        sentAt: message.sentAt,
        deliveredAt: message.deliveredAt,
        readAt: message.readAt,
        failedAt: message.failedAt
      }
    })
  } catch (error) {
    console.log(`Error from message get one controller => `, error)
    return res.status(500).json({ success: false, message: 'something went wrong' })
  }
}

module.exports = getOne;
