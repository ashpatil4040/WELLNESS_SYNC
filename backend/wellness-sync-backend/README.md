# Wellness Sync Backend

A comprehensive wellness tracking API built with Node.js, Express, and MySQL. This backend supports habit tracking, mood monitoring, journaling, and analytics for personal wellness management.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Habit Management**: Create, track, and manage daily habits with progress tracking
- **Mood Tracking**: Log daily mood entries with notes and energy levels
- **Journaling**: Personal journal entries with mood correlation
- **Analytics**: Comprehensive wellness analytics and insights
- **Real-time Notifications**: Email and in-app notifications for reminders
- **Rate Limiting**: Protection against abuse with configurable rate limits
- **Data Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Centralized error handling with detailed logging

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, bcrypt
- **Email**: Nodemailer
- **Testing**: Jest & Supertest

## 📋 Prerequisites

- Node.js 18 or higher
- MySQL 8.0 or higher
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wellness-sync-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your-password
   DB_NAME=wellness_sync
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Database Setup**
   
   Create the database:
   ```sql
   CREATE DATABASE wellness_sync;
   ```
   
   Run migrations and seed data:
   ```bash
   npm run migrate
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Habits Endpoints

#### Get User Habits
```http
GET /api/habits
Authorization: Bearer <token>
```

#### Create Habit
```http
POST /api/habits
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Drink Water",
  "icon": "💧",
  "target": 8,
  "unit": "glasses",
  "color": "#3b82f6"
}
```

#### Update Habit Progress
```http
PATCH /api/habits/:id/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "completed": 5
}
```

### Mood Endpoints

#### Get Mood Entries
```http
GET /api/mood?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

#### Create Mood Entry
```http
POST /api/mood
Authorization: Bearer <token>
Content-Type: application/json

{
  "mood": 4,
  "energy": 3,
  "notes": "Feeling great today!",
  "date": "2024-01-15"
}
```

### Journal Endpoints

#### Get Journal Entries
```http
GET /api/journal?limit=10&search=wellness
Authorization: Bearer <token>
```

#### Create Journal Entry
```http
POST /api/journal
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Wellness Journey",
  "content": "Today I reflected on my progress...",
  "mood": 4,
  "tags": ["wellness", "growth", "reflection"],
  "isPrivate": true
}
```

### Analytics Endpoints

#### Get User Analytics
```http
GET /api/analytics?days=30
Authorization: Bearer <token>
```

#### Get Weekly Analytics
```http
GET /api/analytics/weekly
Authorization: Bearer <token>
```

#### Get Monthly Analytics
```http
GET /api/analytics/monthly?month=1&year=2024
Authorization: Bearer <token>
```

## 🗂️ Project Structure

```
src/
├── config/
│   ├── database.js          # Database configuration
│   ├── cors.js              # CORS settings
│   └── environment.js       # Environment setup
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── habitsController.js  # Habits management
│   ├── moodController.js    # Mood tracking
│   ├── journalController.js # Journal entries
│   ├── analyticsController.js # Analytics & insights
│   └── userController.js    # User management
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── validation.js        # Input validation
│   ├── errorHandler.js      # Error handling
│   └── rateLimiter.js       # Rate limiting
├── models/
│   ├── User.js              # User model
│   ├── Habit.js             # Habit model
│   ├── MoodEntry.js         # Mood entry model
│   ├── JournalEntry.js      # Journal entry model
│   └── index.js             # Model associations
├── routes/
│   ├── auth.js              # Auth routes
│   ├── habits.js            # Habit routes
│   ├── mood.js              # Mood routes
│   ├── journal.js           # Journal routes
│   ├── analytics.js         # Analytics routes
│   ├── users.js             # User routes
│   └── index.js             # Main router
├── services/
│   ├── authService.js       # Auth business logic
│   ├── analyticsService.js  # Analytics calculations
│   ├── emailService.js      # Email notifications
│   └── notificationService.js # Notification system
├── utils/
│   ├── constants.js         # App constants
│   ├── helpers.js           # Utility functions
│   └── validators.js        # Validation helpers
├── scripts/
│   ├── migrate.js           # Database migrations
│   ├── seed.js              # Database seeding
│   └── setup.js             # Setup script
├── app.js                   # Express app setup
└── server.js                # Server entry point
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Using Docker

1. **Build the image**
   ```bash
   docker build -t wellness-sync-backend .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Manual Deployment

1. **Prepare the environment**
   ```bash
   NODE_ENV=production
   npm install --production
   ```

2. **Run migrations**
   ```bash
   npm run migrate
   ```

3. **Start the application**
   ```bash
   npm start
   ```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Configurable request rate limiting
- **Input Validation**: Comprehensive input sanitization
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Security headers and protection
- **SQL Injection Prevention**: Sequelize ORM parameterized queries

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: user, admin)
- `therapistConnected` (Boolean)
- `isActive` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Habits Table
- `id` (Primary Key)
- `name` (String)
- `icon` (String)
- `target` (Integer)
- `completed` (Integer)
- `streak` (Integer)
- `unit` (String)
- `color` (String)
- `userId` (Foreign Key)
- `isActive` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Mood Entries Table
- `id` (Primary Key)
- `mood` (Integer 1-5)
- `moodLabel` (String)
- `notes` (Text)
- `energy` (Integer 1-5)
- `date` (Date)
- `userId` (Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Journal Entries Table
- `id` (Primary Key)
- `title` (String)
- `content` (Text)
- `mood` (Integer 1-5)
- `tags` (JSON Array)
- `date` (Date)
- `userId` (Foreign Key)
- `isPrivate` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@wellnesssync.com or create an issue in the repository.

## 🙏 Acknowledgments

- Express.js community for the excellent framework
- Sequelize team for the robust ORM
- All contributors to the open-source libraries used in this project