
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WebhookEvent extends Model {
    static associate(models) {
      WebhookEvent.belongsTo(models.Message, {
        foreignKey: 'messageId',
        as: 'message',
      });
    }
  }

  WebhookEvent.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      eventId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      messageId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'messages',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM(
          'SENT',
          'DELIVERED',
          'READ',
          'FAILED'
        ),
        allowNull: false,
      },
      occurredAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      processedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      processingResult: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      paranoid: false,
      modelName: 'WebhookEvent',
      tableName: 'webhook_events',
      indexes: [
        {
          unique: true,
          fields: ['event_id'],
        },
        {
          fields: ['message_id'],
        },
      ],
    }
  );

  return WebhookEvent;
};
