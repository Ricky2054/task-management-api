# 📝 Task Management API

A complete full-stack Task Management API built with Node.js, Express.js, and MongoDB. This RESTful API provides comprehensive CRUD operations for managing tasks with advanced features like filtering, pagination, validation, and statistics.

## 🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, Delete tasks
- **Advanced Filtering**: Filter tasks by status, priority, dates, and search terms
- **Pagination**: Efficient data pagination for large datasets
- **Input Validation**: Comprehensive request validation using Joi
- **Error Handling**: Centralized error handling with detailed error messages
- **Database Integration**: MongoDB with Mongoose ODM
- **Statistics**: Task analytics and reporting endpoints
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Environment Configuration**: Flexible environment-based configuration
- **Sample Data**: Database seeding with realistic sample tasks

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **MongoDB** (v4.0 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory based on `env.example`:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/task_management

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup

#### Option A: Local MongoDB
Make sure MongoDB is running locally on port 27017.

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

### 5. Seed the Database (Optional)

Populate the database with sample tasks:

```bash
npm run seed
```

### 6. Start the Server

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /health
```

### API Information
```
GET /api
```

## 🎯 Task Endpoints

### 1. Get All Tasks

**GET** `/api/tasks`

Retrieve all tasks with optional filtering and pagination.

#### Query Parameters:
- `status` - Filter by task status (`pending`, `in-progress`, `completed`, `cancelled`)
- `priority` - Filter by priority (`low`, `medium`, `high`, `urgent`)
- `page` - Page number for pagination (default: 1)
- `limit` - Number of items per page (default: 10)
- `sort` - Field to sort by (default: `createdAt`)
- `order` - Sort order `asc` or `desc` (default: `desc`)
- `search` - Search in title and description

#### Example Requests:

```bash
# Get all tasks
curl -X GET http://localhost:5000/api/tasks

# Get tasks with filtering
curl -X GET "http://localhost:5000/api/tasks?status=pending&priority=high"

# Get tasks with pagination
curl -X GET "http://localhost:5000/api/tasks?page=1&limit=5"

# Search tasks
curl -X GET "http://localhost:5000/api/tasks?search=development"

# Sort tasks
curl -X GET "http://localhost:5000/api/tasks?sort=priority&order=asc"
```

#### Response:
```json
{
  "success": true,
  "count": 5,
  "total": 10,
  "currentPage": 1,
  "totalPages": 2,
  "data": [
    {
      "_id": "60f7b3b4c9e77c1a8c5d4e2f",
      "title": "Sample Task",
      "description": "This is a sample task description",
      "status": "pending",
      "priority": "medium",
      "dueDate": "2024-02-15T00:00:00.000Z",
      "tags": ["development", "api"],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "ageInDays": 5,
      "daysUntilDue": 30
    }
  ]
}
```

### 2. Get Single Task

**GET** `/api/tasks/:id`

#### Example Request:
```bash
curl -X GET http://localhost:5000/api/tasks/60f7b3b4c9e77c1a8c5d4e2f
```

#### Response:
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b4c9e77c1a8c5d4e2f",
    "title": "Sample Task",
    "description": "This is a sample task description",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2024-02-15T00:00:00.000Z",
    "tags": ["development", "api"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Create New Task

**POST** `/api/tasks`

#### Request Body:
```json
{
  "title": "New Task",
  "description": "This is a new task that needs to be completed",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-02-20T00:00:00.000Z",
  "tags": ["urgent", "important"]
}
```

#### Example Request:
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete API Documentation",
    "description": "Write comprehensive documentation for all API endpoints with examples",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-02-01T00:00:00.000Z",
    "tags": ["documentation", "api"]
  }'
```

#### Response:
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "60f7b3b4c9e77c1a8c5d4e2f",
    "title": "Complete API Documentation",
    "description": "Write comprehensive documentation for all API endpoints with examples",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-02-01T00:00:00.000Z",
    "tags": ["documentation", "api"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Task

**PUT** `/api/tasks/:id`

#### Request Body (all fields optional):
```json
{
  "title": "Updated Task Title",
  "description": "Updated task description",
  "status": "in-progress",
  "priority": "medium",
  "dueDate": "2024-02-25T00:00:00.000Z",
  "tags": ["updated", "modified"]
}
```

#### Example Request:
```bash
curl -X PUT http://localhost:5000/api/tasks/60f7b3b4c9e77c1a8c5d4e2f \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "priority": "low"
  }'
```

#### Response:
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "60f7b3b4c9e77c1a8c5d4e2f",
    "title": "Complete API Documentation",
    "description": "Write comprehensive documentation for all API endpoints with examples",
    "status": "completed",
    "priority": "low",
    "dueDate": "2024-02-01T00:00:00.000Z",
    "tags": ["documentation", "api"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z"
  }
}
```

### 5. Delete Task

**DELETE** `/api/tasks/:id`

#### Example Request:
```bash
curl -X DELETE http://localhost:5000/api/tasks/60f7b3b4c9e77c1a8c5d4e2f
```

#### Response:
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {}
}
```

### 6. Get Task Statistics

**GET** `/api/tasks/stats`

Get aggregated statistics about tasks.

#### Example Request:
```bash
curl -X GET http://localhost:5000/api/tasks/stats
```

#### Response:
```json
{
  "success": true,
  "data": {
    "statusStats": [
      { "_id": "pending", "count": 5, "avgPriority": 2.4 },
      { "_id": "in-progress", "count": 3, "avgPriority": 2.7 },
      { "_id": "completed", "count": 2, "avgPriority": 2.0 }
    ],
    "priorityStats": [
      { "_id": "high", "count": 4 },
      { "_id": "medium", "count": 3 },
      { "_id": "low", "count": 2 },
      { "_id": "urgent", "count": 1 }
    ],
    "totalTasks": 10
  }
}
```

## 📋 Data Model

### Task Schema

```javascript
{
  title: String (required, 3-100 characters),
  description: String (required, 10-500 characters),
  status: String (enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending'),
  priority: String (enum: ['low', 'medium', 'high', 'urgent'], default: 'medium'),
  dueDate: Date (optional, must be future date),
  tags: [String] (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

### Virtual Fields
- `ageInDays`: Number of days since task creation
- `daysUntilDue`: Number of days until due date (if set)

## ⚠️ Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

### Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

## 🧪 Testing the API

### Using curl

Test all endpoints with the provided curl commands above.

### Using Postman

Import the API endpoints into Postman:

1. Create a new collection
2. Add requests for each endpoint
3. Set the base URL to `http://localhost:5000/api`
4. Test with various payloads

### Sample Test Workflow

1. **Health Check**: Verify the server is running
```bash
curl -X GET http://localhost:5000/health
```

2. **Create a Task**: Add a new task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task", "description": "This is a test task for API validation"}'
```

3. **Get All Tasks**: Verify the task was created
```bash
curl -X GET http://localhost:5000/api/tasks
```

4. **Update the Task**: Modify the task status
```bash
curl -X PUT http://localhost:5000/api/tasks/{TASK_ID} \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

5. **Delete the Task**: Remove the test task
```bash
curl -X DELETE http://localhost:5000/api/tasks/{TASK_ID}
```

## 🎨 Frontend Integration

The API is designed to work with any frontend framework. Here's a basic JavaScript example:

```javascript
// Create a new task
const createTask = async (taskData) => {
  const response = await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData)
  });
  return response.json();
};

// Get all tasks
const getTasks = async () => {
  const response = await fetch('http://localhost:5000/api/tasks');
  return response.json();
};

// Update a task
const updateTask = async (id, updates) => {
  const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates)
  });
  return response.json();
};

// Delete a task
const deleteTask = async (id) => {
  const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};
```

## 📁 Project Structure

```
task-management-api/
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   └── taskController.js    # Task-related business logic
├── middleware/
│   ├── errorHandler.js      # Error handling middleware
│   └── validation.js        # Request validation middleware
├── models/
│   └── Task.js              # Task data model/schema
├── routes/
│   └── tasks.js             # Task API routes
├── scripts/
│   └── seedData.js          # Database seeding script
├── package.json             # Project dependencies and scripts
├── server.js                # Main application entry point
├── env.example              # Environment variables template
└── README.md                # Project documentation
```

## 🔧 Available Scripts

```bash
# Start the server in production mode
npm start

# Start the server in development mode with auto-restart
npm run dev

# Seed the database with sample data
npm run seed

# Run tests (placeholder)
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- [ ] User authentication and authorization
- [ ] Task assignment to users
- [ ] Email notifications for due dates
- [ ] File attachments for tasks
- [ ] Task comments and activity log
- [ ] Advanced search with full-text indexing
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Integration with calendar applications
- [ ] Mobile app support

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed description
3. Provide steps to reproduce the problem
4. Include environment details (Node.js version, MongoDB version, etc.)

---