
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Tenant, {
        foreignKey: 'tenantId',
        as: 'tenant',
      });

      Message.hasMany(models.WebhookEvent, {
        foreignKey: 'messageId',
        as: 'webhookEvents',
      });
    }
  }

  Message.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'tenants',
          key: 'id',
        },
      },
      conversationId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      to: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          'QUEUED',
          'SENT',
          'DELIVERED',
          'READ',
          'FAILED'
        ),
        allowNull: false,
        defaultValue: 'QUEUED',
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      failedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      paranoid: true,
      modelName: 'Message',
      tableName: 'messages',
      indexes: [
        {
          fields: ['tenant_id', 'conversation_id', 'created_at'],
        },
        {
          fields: ['tenant_id', 'id'],
        },
      ],
    }
  );

  return Message;
};
