require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/dbConnect');
const Task = require('./models/Task');
const User = require('./models/User');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	},
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO Connection
io.on('connection', (socket) => {
	console.log('Client connected');

	socket.on('createTask', async (task) => {
		io.emit(`taskCreated-${task.userId}`, task);
	});

	socket.on('updateTask', async (task) => {
		io.emit(`taskUpdated-${task.userId}`, task);
	});

	socket.on('deleteTask', async ({ taskId, userId }) => {
		io.emit(`taskDeleted-${userId}`, taskId);
	});

	socket.on('reorderTasks', async ({ tasks, userId }) => {
		io.emit(`tasksReordered-${userId}`, tasks);
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

// Routes
app.post('/api/users', async (req, res) => {
	try {
		const { uid, email, displayName } = req.body;
		const user = await User.findOneAndUpdate({ uid }, { email, displayName }, { upsert: true, new: true });
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/api/tasks', async (req, res) => {
	try {
		const { userId } = req.query;
		if (!userId) {
			return res.status(400).json({ error: 'userId is required' });
		}
		const tasks = await Task.find({ userId }).sort('order');
		res.json(tasks);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.post('/api/tasks', async (req, res) => {
	try {
		const { userId, category } = req.body;
		if (!userId) {
			return res.status(400).json({ error: 'userId is required' });
		}

		// Get the last order number for this user and category
		const lastTask = await Task.findOne({ userId, category }).sort('-order');
		const order = lastTask ? lastTask.order + 1 : 0;

		const task = new Task({
			...req.body,
			order,
			createdAt: new Date(),
		});

		const savedTask = await task.save();
		io.emit(`taskCreated-${userId}`, savedTask);
		res.status(201).json(savedTask);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.put('/api/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) {
			return res.status(404).json({ error: 'Task not found' });
		}

		const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

		io.emit(`taskUpdated-${updatedTask.userId}`, updatedTask);
		res.json(updatedTask);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.delete('/api/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) {
			return res.status(404).json({ error: 'Task not found' });
		}

		await Task.findByIdAndDelete(req.params.id);
		io.emit(`taskDeleted-${task.userId}`, req.params.id);
		res.json({ message: 'Task deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.post('/api/tasks/reorder', async (req, res) => {
	try {
		const { tasks, userId } = req.body;
		if (!tasks || !userId) {
			return res.status(400).json({ error: 'tasks and userId are required' });
		}

		// Update all tasks in bulk
		await Promise.all(
			tasks.map((task, index) =>
				Task.findByIdAndUpdate(task._id, {
					order: index,
					category: task.category,
				})
			)
		);

		// Get the updated tasks
		const updatedTasks = await Task.find({ userId }).sort('order');
		io.emit(`tasksReordered-${userId}`, updatedTasks);
		res.json(updatedTasks);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Test route
app.get('/api/test', async (req, res) => {
	try {
		const tasksCount = await Task.countDocuments();
		const usersCount = await User.countDocuments();

		res.json({
			message: 'Database connection successful',
			collections: {
				tasks: tasksCount,
				users: usersCount,
			},
		});
	} catch (error) {
		res.status(500).json({
			error: 'Database connection failed',
			details: error.message,
		});
	}
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
