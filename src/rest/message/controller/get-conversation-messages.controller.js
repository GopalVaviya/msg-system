const { isEmpty } = require('lodash');

const { DEFAULT_LIMIT, DEFAULT_SKIP } = require('../../../env-config/config');
const messageServices = require('../services');

const MAX_LIMIT = 100;

const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit: limitQuery, skip: skipQuery } = req.query;

    if (isEmpty(conversationId) || typeof conversationId !== 'string' || !conversationId.trim()) {
      return res.status(400).json({ success: false, message: 'conversationId must be required' })
    }

    const limit = limitQuery === undefined ? Number(DEFAULT_LIMIT) : Number(limitQuery);

    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
      return res.status(400).json({ success: false, message: `limit must be between 1 and ${MAX_LIMIT}` })
    }

    const skip = skipQuery === undefined ? Number(DEFAULT_SKIP) : Number(skipQuery);

    if (!Number.isInteger(skip) || skip < 0) {
      return res.status(400).json({ success: false, message: 'skip must be a non-negative integer' })
    }

    const result = await messageServices.getConversationMessages({
      tenantId: req.tenantId,
      conversationId: conversationId.trim(),
      limit,
      skip
    });

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        limit,
        skip
      }
    })
  } catch (error) {
    console.log(`Error from message get conversation messages controller => `, error)

    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: status === 500 ? 'something went wrong' : error.message
    })
  }
}

module.exports = getConversationMessages;
