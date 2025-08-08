# News Aggregator API


A RESTful API for news aggregation that allows users to register, login, set preferences, and fetch personalized news articles. Built with Node.js, Express, Prisma, and SQLite.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **User Preferences**: Customizable news categories and language preferences
- **News Aggregation**: Fetch news from GNews API based on user preferences
- **Caching System**: In-memory caching with automatic background updates every 15 minutes
- **Article Management**: Mark articles as read or favorite
- **Search Functionality**: Search news articles by keywords
- **Database Management**: SQLite database with Prisma ORM
- **Comprehensive Testing**: Test suite using TAP framework

## 🛠️ Tech Stack

- **Runtime**: Node.js (>= 18.0.0)
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Testing**: TAP + Supertest
- **Caching**: Node-Cache
- **HTTP Client**: Axios
- **Task Scheduling**: Node-cron
- **Development**: Nodemon

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- GNews API key (optional - defaults to mock data)

## 🔧 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd news-aggregator-api-harry-urek
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # JWT Secret (change this in production)
   JWT_SECRET="your_jwt_secret_here"
   
   # News API Key (get from https://gnews.io/)
   NEWS_API_KEY="your_gnews_api_key_here"
   ```

4. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**:
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication

#### POST /users/signup
Register a new user.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "preferences": ["technology", "sports"]  // optional
}
```

**Response** (200):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

#### POST /users/login
Login with existing credentials.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Preferences

#### GET /users/preferences
Get user preferences (requires authentication).

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response** (200):
```json
{
  "preferences": ["technology", "sports"]
}
```

#### PUT /users/preferences
Update user preferences (requires authentication).

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Body**:
```json
{
  "preferences": ["technology", "sports", "business"],
  "languages": "en"  // optional, defaults to "en"
}
```

### News

#### GET /news
Get personalized news articles (requires authentication).

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response** (200):
```json
{
  "news": [
    {
      "id": "article_id_123",
      "title": "Tech News Article",
      "description": "Article description...",
      "url": "https://example.com/article",
      "image": "https://example.com/image.jpg",
      "publishedAt": "2025-01-01T00:00:00.000Z",
      "source": {
        "name": "TechNews",
        "url": "https://technews.com"
      }
    }
  ],
  "message": "Data retrieved from cache",
  "totalArticles": 25,
  "fromCache": true
}
```

#### POST /news/:id/read
Mark an article as read.

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Body** (optional):
```json
{
  "title": "Article Title",
  "url": "https://example.com/article"
}
```

#### POST /news/:id/favorite
Mark an article as favorite.

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Body** (optional):
```json
{
  "title": "Article Title",
  "url": "https://example.com/article",
  "description": "Article description",
  "image": "https://example.com/image.jpg"
}
```

#### GET /news/read
Get all read articles for the user.

#### GET /news/favorites
Get all favorite articles for the user.

#### GET /news/search/:keyword
Search for news articles by keyword.

**Example**: `GET /news/search/artificial%20intelligence`

## 🗄️ Database Schema

The application uses SQLite with the following models:

- **User**: User account information
- **Preferences**: User's news category and language preferences
- **ReadArticle**: Articles marked as read by users
- **FavoriteArticle**: Articles marked as favorite by users

## 🧪 Testing

Run the test suite:

```bash
npm test
```

The tests cover:
- User registration and authentication
- User preferences management
- News fetching and caching
- Error handling scenarios

## 🚀 Deployment

1. **Production Environment Variables**:
   - Set a strong `JWT_SECRET`
   - Configure `NEWS_API_KEY` with your GNews API key
   - Update `DATABASE_URL` for production database

2. **Database Migration**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start Production Server**:
   ```bash
   NODE_ENV=production npm start
   ```

## 📁 Project Structure

```
├── app.js                 # Express app configuration
├── server.js             # Server entry point
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── prismaClient.js   # Prisma client configuration
│   └── migrations/       # Database migrations
├── controllers/
│   ├── userController.js
│   ├── newsController.js
│   └── preferencesController.js
├── routes/
│   ├── userRoutes.js
│   ├── newsRoutes.js
│   └── preferencesRoutes.js
├── middlewares/
│   └── authMiddleware.js
├── services/
│   ├── cacheService.js
│   └── cacheUpdateService.js
└── test/
    └── server.test.js
```

## 🔄 Caching Strategy

The application implements a sophisticated caching strategy:

- **In-Memory Caching**: Using Node-Cache for fast data retrieval
- **Background Updates**: Automatic cache refresh every 15 minutes
- **User-Specific Caching**: Cache keys based on user preferences
- **TTL Management**: Different TTL for different data types

## 🌐 External APIs

- **GNews API**: Primary news source (100 requests/day free tier)
- **Fallback System**: Mock data when API is unavailable
- **Error Handling**: Graceful fallback to cached or mock data

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Environment Variables**: Sensitive data stored in .env
- **Input Validation**: Request body validation
- **Error Handling**: Secure error messages

