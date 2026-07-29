#  Goal Tracker

A comprehensive task and goal management application built with React frontend and Node.js backend, featuring user authentication, customizable task templates, and progress tracking.

##  Features

### Authentication & User Management
- **User Registration & Login** - Secure JWT-based authentication
- **Profile Management** - User settings and account information
- **Protected Routes** - Secure access to user-specific data

###  Task Management
- **Custom Tasks** - Create personalized tasks with flexible configurations
- **Default Templates** - Pre-built templates for common goal types:
  - **Reading Goals** - Track pages read with daily targets
  - **Exercise Goals** - Monitor workout sessions and progress
  - **Calorie Tracking** - Log meals and track daily calorie intake
  - **Homework Management** - Organize assignments with due dates
  - **Meditation** - Track meditation sessions and duration

###  Progress Tracking
- **Real-time Progress Updates** - Visual progress bars and percentage tracking
- **Daily Goal Calculations** - Automatic daily target recommendations
- **Task Completion** - Mark tasks as complete with 100% progress display
- **Statistics Dashboard** - Overview of completed and active tasks

### User Interface
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Interactive Modals** - Easy task creation and customization
- **Visual Feedback** - Success messages and loading states

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Context API** - State management for authentication and tasks
- **CSS3** - Modern styling with responsive design

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Sequelize** - SQL ORM for database operations
- **SQLite** - Lightweight database for development
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing and security

### Development Tools
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **Nodemon** - Development server with auto-restart
- **ESLint** - Code linting and formatting

## Project Structure

```
goalTracker/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Route handlers and business logic
│   │   ├── middleware/      # Custom middleware functions
│   │   ├── models/          # Sequelize database models
│   │   ├── routes/          # API route definitions
│   │   ├── seed/            # Database seeding and migration
│   │   ├── tests/           # Backend test suites
│   │   ├── utils/           # Utility functions and helpers
│   │   └── server.js        # Main server entry point
│   ├── package.json
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── styles/          # CSS stylesheets
│   │   └── App.jsx          # Main React application
│   ├── package.json
│   └── index.html
├── package.json             # Root package configuration
└── README.md
```

## Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goalTracker
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Setup

1. **Create backend environment file**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Configure environment variables** (edit the `.env` file):
   ```env
   NODE_ENV=development
   PORT=5001
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   DB_PATH=./database.sqlite
   ```

### Database Setup

1. **Run database migrations**
   ```bash
   cd backend
   npm run migrate
   ```

### Running the Application

#### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Backend will be available at: `http://localhost:5001`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will be available at: `http://localhost:3000`

#### Production Mode

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend in production**
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

## Testing

### Running Tests

1. **Run all tests**
   ```bash
   cd backend
   npm test
   ```

2. **Run tests with coverage**
   ```bash
   cd backend
   npm test -- --coverage
   ```

### Test Coverage

The test suite includes:
- **Authentication Tests** - User registration, login, and JWT validation
- **Database Tests** - Model validations and relationships
- **Utility Tests** - Helper functions and calculations

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <jwt_token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "type": "reading|exercise|calories|homework|meditation",
  "totalSteps": number,
  "config": {
    // Type-specific configuration
  }
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "string",
  "completedSteps": number,
  "isCompleted": boolean
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <jwt_token>
```

### Template Endpoints

#### Get Default Templates
```http
GET /api/admin/templates
```

## Task Types & Configurations

### Reading Tasks
```json
{
  "type": "reading",
  "config": {
    "totalPages": 500,
    "currentPage": 0,
    "dailyGoal": 50
  }
}
```

### Exercise Tasks
```json
{
  "type": "exercise",
  "config": {
    "totalSessions": 30,
    "completedSessions": 0,
    "dailyGoal": 1
  }
}
```

### Calorie Tasks
```json
{
  "type": "calories",
  "config": {
    "targetCalories": 2000,
    "currentCalories": 0,
    "meals": {
      "breakfast": 0,
      "lunch": 0,
      "dinner": 0,
      "snacks": 0
    }
  }
}
```

### Homework Tasks
```json
{
  "type": "homework",
  "config": {
    "assignments": [
      {
        "name": "Math Assignment",
        "dueDate": "2025-01-15",
        "progress": 0
      }
    ]
  }
}
```

### Meditation Tasks
```json
{
  "type": "meditation",
  "config": {
    "totalMinutes": 1000,
    "completedMinutes": 0,
    "dailyGoal": 20
  }
}
```

## Configuration

### Database Configuration
The application uses SQLite for development and can be configured for other databases in production:

```javascript
// backend/src/config/database.js
const config = {
  development: {
    dialect: 'sqlite',
    storage: './database.sqlite'
  },
  production: {
    // Configure for production database
  }
};
```

### JWT Configuration
JWT tokens are configured with a 1-hour expiration:

```javascript
// Token generation
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
```

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5001
JWT_SECRET=your-production-jwt-secret
DB_PATH=/path/to/production/database.sqlite
```

### Build for Production
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd ../backend
NODE_ENV=production npm start
```


## License

All rights reserved. This project is for personal use only.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## Acknowledgments

- Built with modern web technologies
- Inspired by productivity and goal-setting methodologies
- Designed for simplicity and effectiveness
- AI was used in development

---

**Happy Goal Tracking!**
