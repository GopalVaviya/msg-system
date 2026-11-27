# Message System REST API

A REST API service built with Express.js and Sequelize for managing tenants, storing messages, reading conversation timelines, and processing provider delivery webhooks.

## Base URL

```text
http://localhost:4000
```

## Getting Started

```bash
npm install
npm run dev
```

For production-like execution:

```bash
npm start
```

## Environment Configuration

Copy `.env.sample` to `.env` and update the values as needed:

```env
PORT=4000
DEFAULT_LIMIT=20
DEFAULT_SKIP=0

DATABASE_HOST=localhost
DATABASE_NAME=msg-system
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=1111
DATABASE_DIALECT=postgres
```

`DEFAULT_LIMIT` and `DEFAULT_SKIP` are used by the conversation messages endpoint when `limit` and `skip` are not provided in the query string.

## Response Conventions

Tenant endpoints return responses in this shape:

```json
{
  "message": "operation completed successfully",
  "data": {}
}
```

Message and webhook endpoints return responses in this shape:

```json
{
  "success": true,
  "data": {}
}
```

Validation and not-found responses use HTTP `400` and `404` respectively.

---

## API Reference

### 1. Create Tenant

```http
POST http://localhost:4000/api/v1/tenant/create
```

Creates a new tenant/business in the `tenants` table.

#### Request Body

```json
{
  "name": "Craft & Co."
}
```

#### Response — `201 Created`

```json
{
  "message": "tenant created successfully",
  "data": {
    "id": "6049e65c-546f-4c4e-9c86-7413a0e49486",
    "name": "Craft & Co.",
    "createdAt": "2026-11-27T02:20:00.000Z",
    "updatedAt": "2026-11-27T02:20:00.000Z",
    "deletedAt": null
  }
}
```

---

### 2. Get All Tenants

```http
GET http://localhost:4000/api/v1/tenant
```

Returns all non-deleted tenants ordered by latest creation time.

#### Request Body

None.

#### Response — `200 OK`

```json
{
  "message": "tenants fetched successfully",
  "data": [
    {
      "id": "6049e65c-546f-4c4e-9c86-7413a0e49486",
      "name": "Craft & Co.",
      "createdAt": "2026-11-27T02:20:00.000Z",
      "updatedAt": "2026-11-27T02:20:00.000Z",
      "deletedAt": null
    }
  ]
}
```

---

### 3. Get Single Tenant

```http
GET http://localhost:4000/api/v1/tenant/{tenantId}
```

Returns one tenant by UUID.

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `tenantId` | UUID string | Yes | Tenant identifier |

#### Request Body

None.

#### Response — `200 OK`

```json
{
  "message": "tenant fetched successfully",
  "data": {
    "id": "6049e65c-546f-4c4e-9c86-7413a0e49486",
    "name": "Craft & Co.",
    "createdAt": "2026-11-27T02:20:00.000Z",
    "updatedAt": "2026-11-27T02:20:00.000Z",
    "deletedAt": null
  }
}
```

#### Response — `404 Not Found`

```json
{
  "message": "tenant not found"
}
```

---

### 4. Create Message

```http
POST http://localhost:4000/api/v1/message/create
```

Creates a new message for a tenant. The tenant must already exist. The initial message status is always `QUEUED`.

#### Request Body

```json
{
  "tenantId": "6049e65c-546f-4c4e-9c86-7413a0e49486",
  "conversationId": "conversation-101",
  "to": "+919876543210",
  "text": "Hello, how are you?"
}
```

#### Response — `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "7c10a16f-c085-4b13-92c7-255bbf90847f",
    "tenantId": "6049e65c-546f-4c4e-9c86-7413a0e49486",
    "conversationId": "conversation-101",
    "to": "+919876543210",
    "text": "Hello, how are you?",
    "status": "QUEUED"
  }
}
```

---

### 5. Get Conversation Messages

```http
GET http://localhost:4000/api/v1/message/conversation/{conversationId}?limit=20&skip=0
```

Returns messages for one conversation. Results are tenant-scoped through the `x-tenant-id` header and ordered oldest first.

#### Headers

| Header | Type | Required | Description |
| --- | --- | --- | --- |
| `x-tenant-id` | UUID string | Yes | Tenant identifier, validated by middleware |

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `conversationId` | String | Yes | Conversation identifier |

#### Query Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `limit` | Integer | No | `DEFAULT_LIMIT` | Number of messages to return; maximum `100` |
| `skip` | Integer | No | `DEFAULT_SKIP` | Number of messages to skip |

#### Request Body

None.

#### Response — `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "7c10a16f-c085-4b13-92c7-255bbf90847f",
      "conversationId": "conversation-101",
      "text": "Hello, how are you?",
      "status": "DELIVERED"
    },
    {
      "id": "85e31335-753d-415d-9e17-3a632704b22d",
      "conversationId": "conversation-101",
      "text": "Hi",
      "status": "QUEUED"
    }
  ],
  "pagination": {
    "limit": 20,
    "skip": 0
  }
}
```

---

### 6. Get Message Details

```http
GET http://localhost:4000/api/v1/message/{messageId}
```

Returns details and the latest delivery status of a message. The message must belong to the tenant supplied in the header.

#### Headers

| Header | Type | Required | Description |
| --- | --- | --- | --- |
| `x-tenant-id` | UUID string | Yes | Tenant identifier, validated by middleware |

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `messageId` | UUID string | Yes | Message identifier |

#### Request Body

None.

#### Response — `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "7c10a16f-c085-4b13-92c7-255bbf90847f",
    "conversationId": "conversation-101",
    "to": "+919876543210",
    "text": "Hello, how are you?",
    "status": "DELIVERED",
    "sentAt": "2026-11-27T10:00:00.000Z",
    "deliveredAt": "2026-11-27T10:30:00.000Z",
    "readAt": null,
    "failedAt": null
  }
}
```

#### Response — `404 Not Found`

```json
{
  "success": false,
  "message": "message not found"
}
```

---

### 7. Provider Webhook

```http
POST http://localhost:4000/api/v1/webhooks/provider
```

Receives delivery status updates from an external messaging provider. The event is stored in `webhook_events` and the matching message is updated inside a database transaction.

Allowed statuses are `SENT`, `DELIVERED`, `READ`, and `FAILED`.

#### Request Body

```json
{
  "eventId": "event-001",
  "messageId": "7c10a16f-c085-4b13-92c7-255bbf90847f",
  "status": "DELIVERED",
  "occurredAt": "2026-11-27T10:30:00Z"
}
```

#### Response — `200 OK`

```json
{
  "success": true,
  "duplicate": false,
  "data": {
    "eventId": "event-001",
    "messageId": "7c10a16f-c085-4b13-92c7-255bbf90847f",
    "eventStatus": "DELIVERED",
    "occurredAt": "2026-11-27T10:30:00.000Z",
    "processingResult": "PROCESSED",
    "messageStatus": "DELIVERED",
    "processed": true
  }
}
```

#### Duplicate Event Response

Replaying the same `eventId` does not process the event twice.

```json
{
  "success": true,
  "duplicate": true,
  "data": {
    "eventId": "event-001",
    "messageId": "7c10a16f-c085-4b13-92c7-255bbf90847f",
    "eventStatus": "DELIVERED",
    "occurredAt": "2026-11-27T10:30:00.000Z",
    "processingResult": "PROCESSED",
    "messageStatus": null,
    "processed": false
  }
}
```

#### Out-of-Order Event Policy

Status progression is monotonic:

```text
QUEUED (0) < SENT (1) < DELIVERED (2) < READ (3) / FAILED (3)
```

A later status may advance the message even if an intermediate event was missed. Older or equal-level events are recorded with `processingResult: "IGNORED_STATUS"` and never move the message backwards. `READ` and `FAILED` are treated as terminal states.

#### Error Responses

Invalid status:

```json
{
  "success": false,
  "message": "message not found"
}
```

All endpoints documented above are Postman-ready and can be copied as cURL commands for quick terminal-based testing.

## Postman Collection

A ready-to-use Postman collection is included in this repository:

[Import msg-system.postman_collection.json](./msg-system.postman_collection.json)

Open Postman, choose `File → Import`, select the collection file above, and run the requests in the same order as the API reference.

Unknown message:

```json
{
  "success": false,
  "message": "message not found"
}
```
