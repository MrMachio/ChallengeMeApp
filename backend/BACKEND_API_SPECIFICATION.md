# Backend API Specification - ChallengeMeApp

## Overview

This document defines the backend API endpoints required for ChallengeMeApp - a social challenge platform where users can create, accept, and complete various challenges while interacting with friends.

## Base Configuration

- **Base URL**: `http://localhost:8081/api`
- **Authentication**: Bearer Token in `Authorization: Bearer {token}` header
- **Content-Type**: `application/json`
- **File Uploads**: `multipart/form-data`

## HTTP Status Codes

### Success (2xx)
- `200 OK` - Request successful
- `201 Created` - Resource created successfully  
- `204 No Content` - Successful deletion

### Client Errors (4xx)
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `409 Conflict` - Data conflict (e.g., duplicate username)
- `422 Unprocessable Entity` - Validation errors

### Server Errors (5xx)
- `500 Internal Server Error` - Internal server error

## Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "username": "Username must be 3-20 characters",
      "email": "Invalid email format"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔐 Authentication Endpoints (4 endpoints)

### POST /auth/login
**Description**: User authentication
**Usage**: useAuth hook in components
```json
Request Body:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "user": {
    "id": "string",
    "username": "string", 
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "avatarUrl": "string",
    "bio": "string",
    "createdAt": "string",
    "points": "number",
    "level": "number",
    "activeChallenges": ["string"],
    "pendingChallenges": ["string"],
    "completedChallenges": ["string"],
    "favoritesChallenges": ["string"],
    "createdChallenges": ["string"]
  },
  "token": "string",
  "expiresIn": "number"
}
```

### POST /auth/register  
**Description**: User registration
**Usage**: useAuth hook in components
```json
Request Body:
{
  "username": "string",     // 3-20 characters, alphanumeric + underscore
  "email": "string",        // valid email address
  "password": "string",     // minimum 8 characters
  "firstName": "string?",   // optional, max 50 characters
  "lastName": "string?"     // optional, max 50 characters
}

Response: Same as /auth/login
```

### GET /auth/me
**Description**: Get current authenticated user
**Authentication**: Required
```json
Response: User object (same as login response.user)
```

### GET /users/username/{username}
**Description**: Get public user profile by username
**Usage**: Profile page (/profile/[username])
```json
Response: {
  "id": "string",
  "username": "string",
  "firstName": "string", 
  "lastName": "string",
  "avatarUrl": "string",
  "bio": "string",
  "createdAt": "string",
  "points": "number",
  "level": "number"
  // Note: email and private fields excluded for public profiles
}
```

### PUT /users/me
**Description**: Update current user profile
**Authentication**: Required
**Usage**: Profile settings/edit page
```json
Request Body:
{
  "firstName": "string?",
  "lastName": "string?", 
  "avatarUrl": "string?",
  "bio": "string?"    // max 500 characters
}

Response: Updated User object (full profile)
```

---

## 🎯 Challenges Endpoints (6 endpoints)

### POST /challenges
**Description**: Create new challenge
**Authentication**: Required
**Usage**: CreateChallengeModal component
```json
Request Body:
{
  "title": "string",        // 5-100 characters
  "description": "string",  // 10-1000 characters
  "category": "string",     // valid category
  "difficulty": "string",   // easy, medium, hard
  "imageUrl": "string",     // image URL
  "points": "number"        // 50-1000 points
}

Response: Created Challenge object
```

### GET /challenges/{challengeId}/status
**Description**: Get challenge status for current user  
**Authentication**: Required
**Usage**: useChallengeStatus hook
```json
Response:
{
  "status": "none|active|pending|completed",
  "proofUrl": "string?",
  "proofDescription": "string?", 
  "submittedAt": "string?",
  "completedAt": "string?"
}
```

### PUT /challenges/{challengeId}/status
**Description**: Update challenge status (accept, submit proof, etc.)
**Authentication**: Required  
**Usage**: useChallengeStatus hook
```json
Request Body:
{
  "action": "accept|submit_proof|approve|reject",
  "proofData": {
    "proofUrl": "string?",
    "description": "string?",
    "proofType": "image|video?"
  }
}

Response: 204 No Content
```

### POST /challenges/{challengeId}/favorite
**Description**: Toggle favorite status
**Authentication**: Required
**Usage**: ChallengeModal, ChallengeCard components
```json
Response:
{
  "isFavorite": "boolean"
}
```

### GET /challenges/{challengeId}/favorite-status
**Description**: Get favorite status for current user
**Authentication**: Required
**Usage**: ChallengeModal component
```json
Response:
{
  "isFavorite": "boolean"
}
```

### GET /challenges/favorites
**Description**: Get user's favorite challenges with pagination
**Authentication**: Required
**Query Parameters**:
- `page` - page number (default: 1)
- `limit` - items per page (default: 20)
```json
Response: {
  "challenges": [Challenge objects],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

---

## 👥 Friends Endpoints (7 endpoints)

### GET /friends/status/{userId1}/{userId2}
**Description**: Get friendship status between two users
**Authentication**: Required
**Usage**: UserCard component
```json
Response:
{
  "status": "none|friends|pending|received", 
  "requestId": "string?"
}
```

### POST /friends/request
**Description**: Send friend request
**Authentication**: Required
**Usage**: UserCard component
```json
Request Body:
{
  "receiverId": "string"
  // Note: senderId extracted from JWT token
}

Response:
{
  "success": "boolean",
  "message": "string"
}
```

### POST /friends/request/{requestId}/accept
**Description**: Accept friend request
**Authentication**: Required
**Usage**: UserCard, Profile components
```json
Request Body: {} // Empty - userId extracted from JWT token

Response:
{
  "success": "boolean", 
  "message": "string"
}
```

### POST /friends/request/{requestId}/reject
**Description**: Reject friend request
**Authentication**: Required
**Usage**: Profile component
```json
Request Body: {} // Empty - userId extracted from JWT token

Response:
{
  "success": "boolean",
  "message": "string" 
}
```

### DELETE /friends/{friendId}
**Description**: Remove friend
**Authentication**: Required
**Usage**: Profile component
```json
Request Body: {} // Empty - userId extracted from JWT token

Response:
{
  "success": "boolean",
  "message": "string"
}
```

### GET /users/{userId}/friends
**Description**: Get user's friends list
**Usage**: Users page, Profile page
```json
Response: Array of User objects
```

### GET /users/{userId}/friend-requests
**Description**: Get pending friend requests for user
**Usage**: Users page, Profile page
```json
Response:
{
  "sent": [
    {
      "id": "string",
      "senderId": "string", 
      "receiverId": "string",
      "status": "pending|accepted|rejected",
      "createdAt": "string",
      "sender": {
        "id": "string",
        "username": "string",
        "avatarUrl": "string"
      }
    }
  ],
  "received": []  // same structure
}
```

---

## 💬 Chat Endpoints (3 endpoints)

### POST /chats/direct
**Description**: Get or create direct chat between two users
**Authentication**: Required
**Usage**: Users page, ChatWindow component
```json
Request Body:
{
  "userId1": "string",
  "userId2": "string"
}

Response:
{
  "id": "string",
  "participants": ["string"],
  "messages": [
    {
      "id": "string",
      "senderId": "string",
      "receiverId": "string", 
      "content": "string",
      "type": "text|challenge",
      "challengeId": "string?",
      "timestamp": "string",
      "isRead": "boolean"
    }
  ],
  "lastMessage": "Message?",
  "unreadCount": "number",
  "createdAt": "string"
}
```

### POST /chats/{chatId}/messages
**Description**: Send message in chat
**Authentication**: Required
**Usage**: ChatWindow component
```json
Request Body:
{
  "content": "string",
  "type": "text|challenge?",
  "challengeId": "string?"
  // Note: senderId extracted from JWT token
}

Response: Message object
```

### POST /chats/{chatId}/read
**Description**: Mark messages as read
**Authentication**: Required
**Usage**: Users page
```json
Request Body: {} // Empty - userId extracted from JWT token

Response:
{
  "success": "boolean"
}
```

---

## 🔔 Notifications Endpoints (1 endpoint)

### GET /notifications/{userId}/unread-count
**Description**: Get unread notifications count
**Usage**: Users page notification badge
```json
Response:
{
  "count": "number"
}
```

---

## 📁 File Upload Endpoints (1 endpoint)

### POST /images/upload
**Description**: Upload image file
**Authentication**: Required
**Usage**: CreateChallengeModal component
**Content-Type**: `multipart/form-data`
```json
Request: FormData with file

Response:
{
  "imageUrl": "string"
}
```

---

## 👤 Users Endpoints (1 endpoint)

### GET /users
**Description**: Get list of all users
**Usage**: Users page
**Query Parameters**:
- `page` - page number (default: 1)
- `limit` - items per page (default: 20)
- `search` - search by username/name

```json
Response:
{
  "users": [User objects],
  "total": "number",
  "page": "number", 
  "totalPages": "number"
}
```

---

## 📊 Total: 24 Endpoints

- **Authentication**: 4 endpoints
- **Challenges**: 6 endpoints  
- **Friends**: 7 endpoints
- **Chat**: 3 endpoints
- **Notifications**: 1 endpoint
- **File Upload**: 1 endpoint
- **Users**: 2 endpoints

## 🔧 Technical Requirements

### Framework & Database
- **Spring Boot**: 3.2+ (latest stable)
- **Database**: PostgreSQL 15+
- **Migrations**: Flyway
- **Validation**: Spring Boot Validation with annotations

### Authentication & Security
- **JWT Tokens**: Access tokens (15 minutes) + Refresh tokens (7 days)
- **Password Hashing**: BCrypt
- **CORS**: Configure for `localhost:3000` (dev) and production domains
- **Rate Limiting**: 100 requests/minute per user

### File Handling
- **Supported Formats**: JPG, PNG for images
- **Max File Size**: 5MB for images
- **Storage**: Local filesystem or cloud storage (AWS S3)

### API Features
- **Pagination**: Standard pagination for list endpoints
- **Validation**: Comprehensive input validation
- **Error Handling**: Consistent error response format
- **Logging**: Request/response logging with SLF4J

## 🚀 Implementation Priority

1. **Phase 1**: Authentication + Users (core functionality)
2. **Phase 2**: Challenges (main feature)  
3. **Phase 3**: Friends (social features)
4. **Phase 4**: Chat (communication)
5. **Phase 5**: Notifications + File Upload (enhancements)

This specification covers all endpoints actually used by the frontend components, ensuring a lean and efficient backend implementation.

## 📝 Note on Current Implementation

The frontend currently uses:
- **RTK Query**: For the 24 endpoints listed above  
- **Next.js API routes**: For `/api/challenges/{id}` (challenge detail page)
- **Mock data**: For displaying challenge lists and other data

The home page loads challenges from mock data, not from API calls. The challenge detail page uses Next.js API routes instead of RTK Query. This specification represents the backend endpoints needed to replace the current mock/API route system.

## 🔧 Security & Implementation Notes

- **JWT Token Usage**: User ID is extracted from JWT tokens for most operations, eliminating the need to pass `userId` in request bodies
- **Public vs Private Data**: Public profile endpoints exclude sensitive information like email addresses
- **Validation**: All inputs are validated using Spring Boot Validation annotations
- **Pagination**: Applied to list endpoints that may return large datasets
- **File Upload**: Restricted to JPG/PNG images, maximum 5MB per file 