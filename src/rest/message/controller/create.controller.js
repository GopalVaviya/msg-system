const { isEmpty } = require('lodash');

const messageServices = require('../services');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const create = async (req, res) => {
  try {
    const { tenantId, conversationId, to, text } = req.body || {};

    if (isEmpty(tenantId) || typeof tenantId !== 'string' || !UUID_REGEX.test(tenantId.trim())) {
      return res.status(400).json({ success: false, message: 'tenantId must be a valid UUID' })
    }

    if (isEmpty(conversationId) || typeof conversationId !== 'string' || !conversationId.trim()) {
      return res.status(400).json({ success: false, message: 'conversationId must be required' })
    }

    if (isEmpty(to) || typeof to !== 'string' || !to.trim()) {
      return res.status(400).json({ success: false, message: 'to must be required' })
    }

    if (isEmpty(text) || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ success: false, message: 'text must be required' })
    }

    const message = await messageServices.create({
      tenantId: tenantId.trim(),
      conversationId: conversationId.trim(),
      to: to.trim(),
      text: text.trim()
    });

    return res.status(201).json({
      success: true,
      data: {
        id: message.id,
        tenantId: message.tenantId,
        conversationId: message.conversationId,
        to: message.to,
        text: message.text,
        status: message.status
      }
    })
  } catch (error) {
    console.log(`Error from message create controller => `, error)

    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: status === 500 ? 'something went wrong' : error.message
    })
  }
}

module.exports = create;
