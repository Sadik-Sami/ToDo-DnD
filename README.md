Live : https://todo-b0574.web.app/ 
```
backend/
├── config/
│   └── dbConnect.js     # MongoDB connection setup
├── models/
│   ├── Task.js          # Task mongoose model
│   └── User.js          # User mongoose model
├── .env                 # Environment variables
├── index.js            # Main application file
└── package.json        # Project dependencies
```
## Features

### Database Models

#### Task Model
```javascript
{
  title: String,          // Required, max 50 chars
  description: String,    // Optional, max 200 chars
  category: String,       // Required: 'To-Do', 'In Progress', 'Done'
  order: Number,         // Required, for ordering within category
  userId: String,        // Required, links to user
  createdAt: Date       // Auto-generated timestamp
}
```

#### User Model

```javascript
{
  uid: String,          // Firebase Auth UID
  email: String,        // User's email
  displayName: String   // User's display name
}
```

### API Endpoints

#### User Endpoints

- `POST /api/users`

- Creates/updates user in database
- Used when user signs in with Firebase





#### Task Endpoints

- `GET /api/tasks?userId={userId}`

- Retrieves all tasks for a specific user
- Sorted by order within each category



- `POST /api/tasks`

- Creates a new task
- Automatically assigns order number
- Triggers real-time update



- `PUT /api/tasks/:id`

- Updates existing task
- Can update title, description, category
- Triggers real-time update



- `DELETE /api/tasks/:id`

- Deletes a task
- Triggers real-time update



- `POST /api/tasks/reorder`

- Updates task order after drag-and-drop
- Updates category if moved between columns
- Triggers real-time update





### Real-time Updates

Socket.IO events are user-specific to ensure users only receive updates for their own tasks:

- `taskCreated-{userId}`: When a new task is created
- `taskUpdated-{userId}`: When a task is modified
- `taskDeleted-{userId}`: When a task is removed
- `tasksReordered-{userId}`: When tasks are reordered


## Setup Instructions

1. Install dependencies:


```shellscript
npm install
```

2. Create .env file:


```plaintext
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

3. Start the server:


```shellscript
# Development
npm run dev

# Production
npm start
```

## Database Connection

The application uses MongoDB with Mongoose for data persistence. The connection is handled in `config/dbConnect.js`:

- Automatically creates required collections if they don't exist
- Sets up indexes for better query performance
- Handles connection errors gracefully


## Error Handling

- All routes include try-catch blocks
- Proper error status codes and messages
- Validation errors for required fields
- Database connection error handling


## Security

- CORS enabled for frontend application
- User authentication required for all task operations
- User-specific data isolation
- Input validation and sanitization


```plaintext

```markdown file="frontend/README.md" type="code"
# Task Management Frontend

A React-based task management application with drag-and-drop functionality and real-time updates.

## Technologies Used

- React (Vite)
- Firebase Authentication
- Socket.IO Client
- Zustand for state management
- React Beautiful DND
- Tailwind CSS
- React Hot Toast
- Axios

## Project Structure

```

frontend/
├── src/
│   ├── components/
│   │   ├── TaskCard.jsx
│   │   ├── AddTaskModal.jsx
│   │   └── EditTaskModal.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── stores/
│   │   ├── authStore.js
│   │   └── taskStore.js
│   ├── config/
│   │   └── firebase.js
│   └── App.jsx
├── .env
└── package.json

```plaintext

## Features

### Authentication

- Google Sign-in using Firebase
- Persistent authentication state
- Automatic user data synchronization with backend
- Protected routes

### Task Management

- Create, read, update, and delete tasks
- Drag-and-drop functionality
  - Reorder tasks within categories
  - Move tasks between categories
- Real-time updates across all connected clients
- Optimistic updates for better UX

### User Interface

- Clean, modern design
- Responsive layout
- Dark mode support
- Loading states
- Toast notifications
- Modal dialogs for task operations

## State Management

### Auth Store (authStore.js)

Manages authentication state using Zustand:
```javascript
{
  user: null | User,
  loading: boolean,
  error: string | null,
  loginWithGoogle: () => Promise<void>,
  logout: () => Promise<void>,
  initAuth: () => () => void
}
```

### Task Store (taskStore.js)

Manages tasks and real-time updates:

```javascript
{
  tasks: Task[],
  loading: boolean,
  error: string | null,
  fetchTasks: () => Promise<void>,
  addTask: (task: Task) => Promise<void>,
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>,
  deleteTask: (id: string) => Promise<void>,
  reorderTasks: (result: DropResult) => Promise<void>
}
```

## Real-time Updates

Socket.IO is used for real-time updates:

1. Connection established on dashboard mount
2. User-specific event listeners:

1. `taskCreated-{userId}`
2. `taskUpdated-{userId}`
3. `taskDeleted-{userId}`
4. `tasksReordered-{userId}`



3. Automatic state updates on events
4. Cleanup on component unmount


## Setup Instructions

1. Install dependencies:


```shellscript
npm install
```

2. Create .env file:


```plaintext
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

3. Start the development server:


```shellscript
npm run dev
```

## Component Details

### Dashboard

Main application interface:

- Displays task columns (To-Do, In Progress, Done)
- Handles drag-and-drop interactions
- Manages real-time connection
- Dark mode toggle


### TaskCard

Individual task display:

- Shows task title and description
- Edit and delete actions
- Drag handle
- Due date display (if set)


### AddTaskModal & EditTaskModal

Task form modals:

- Input validation
- Loading states
- Error handling
- Category selection


## Error Handling

- Form validation
- API error handling
- Toast notifications
- Loading states
- Authentication error handling


## Performance Optimizations

- Optimistic updates
- Debounced API calls
- Proper cleanup of event listeners
- Efficient re-renders using memo
- Socket.IO connection management


## Styling

- Tailwind CSS for styling
- Dark mode support
- Responsive design
- Loading animations
- Smooth transitions


```plaintext

This documentation covers:

1. Complete project structure
2. All implemented features
3. Setup instructions
4. State management details
5. Real-time functionality
6. Error handling
7. Performance considerations

The application works by:

1. Frontend:
- User authenticates with Firebase
- Auth state is persisted in localStorage
- Tasks are fetched on dashboard mount
- Real-time connection established
- User can perform CRUD operations
- Drag-and-drop updates task order/category
- All changes are synced in real-time

2. Backend:
- Handles user authentication state
- Manages task CRUD operations
- Maintains task order
- Broadcasts real-time updates
- Stores data in MongoDB
- Ensures data consistency

3. Real-time Flow:
```

User Action → Frontend State Update → API Call →
Backend Processing → Database Update →
Socket.IO Event → All Connected Clients → State Update

```plaintext

This creates a seamless, real-time task management experience with proper error handling and user-specific data isolation.
```
