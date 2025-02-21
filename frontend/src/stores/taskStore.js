import { create } from 'zustand';
import axios from 'axios';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { auth } from '../config/firebase';

const BACKEND_URL = 'http://localhost:5000';
const socket = io(BACKEND_URL);

export const useTaskStore = create((set, get) => ({
	tasks: [],
	loading: false,
	error: null,

	initializeSocketListeners: () => {
		const user = auth.currentUser;
		if (!user) return;

		socket.on(`taskCreated-${user.uid}`, (newTask) => {
			set((state) => ({
				tasks: [...state.tasks, newTask],
			}));
			toast.success('Task added successfully');
		});

		socket.on(`taskUpdated-${user.uid}`, (updatedTask) => {
			set((state) => ({
				tasks: state.tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
			}));
			toast.success('Task updated successfully');
		});

		socket.on(`taskDeleted-${user.uid}`, (taskId) => {
			set((state) => ({
				tasks: state.tasks.filter((task) => task._id !== taskId),
			}));
			toast.success('Task deleted successfully');
		});

		socket.on(`tasksReordered-${user.uid}`, (updatedTasks) => {
			set({ tasks: updatedTasks });
		});

		return () => {
			socket.off(`taskCreated-${user.uid}`);
			socket.off(`taskUpdated-${user.uid}`);
			socket.off(`taskDeleted-${user.uid}`);
			socket.off(`tasksReordered-${user.uid}`);
		};
	},

	fetchTasks: async () => {
		try {
			const user = auth.currentUser;
			if (!user) {
				throw new Error('User not authenticated');
			}

			set({ loading: true });
			const response = await axios.get(`${BACKEND_URL}/api/tasks?userId=${user.uid}`);
			set({ tasks: response.data, loading: false });
		} catch (error) {
			set({ loading: false, error: error.message });
			toast.error('Failed to fetch tasks');
		}
	},

	addTask: async (taskData) => {
		try {
			const user = auth.currentUser;
			if (!user) {
				throw new Error('User not authenticated');
			}

			const task = {
				...taskData,
				userId: user.uid,
			};

			await axios.post(`${BACKEND_URL}/api/tasks`, task);
			// Socket will handle state update
		} catch (error) {
			toast.error('Failed to add task');
			throw error;
		}
	},

	updateTask: async (taskId, updates) => {
		try {
			const user = auth.currentUser;
			if (!user) {
				throw new Error('User not authenticated');
			}

			await axios.put(`${BACKEND_URL}/api/tasks/${taskId}`, updates);
			// Socket will handle state update
		} catch (error) {
			toast.error('Failed to update task');
			throw error;
		}
	},

	deleteTask: async (taskId) => {
		try {
			const user = auth.currentUser;
			if (!user) {
				throw new Error('User not authenticated');
			}

			await axios.delete(`${BACKEND_URL}/api/tasks/${taskId}`);
			// Socket will handle state update
		} catch (error) {
			toast.error('Failed to delete task');
			throw error;
		}
	},

	reorderTasks: async (result) => {
		try {
			const user = auth.currentUser;
			if (!user) {
				throw new Error('User not authenticated');
			}

			const { destination, source, draggableId } = result;
			if (!destination) return;

			const tasks = Array.from(get().tasks);
			const [removed] = tasks.splice(source.index, 1);
			tasks.splice(destination.index, 0, removed);

			// Update category if moved between columns
			if (source.droppableId !== destination.droppableId) {
				const taskIndex = tasks.findIndex((t) => t._id === draggableId);
				if (taskIndex !== -1) {
					tasks[taskIndex] = {
						...tasks[taskIndex],
						category: destination.droppableId,
					};
				}
			}

			// Update order numbers
			const updatedTasks = tasks.map((task, index) => ({
				...task,
				order: index,
			}));

			await axios.post(`${BACKEND_URL}/api/tasks/reorder`, {
				tasks: updatedTasks,
				userId: user.uid,
			});
			// Socket will handle state update
		} catch (error) {
			toast.error('Failed to reorder tasks');
			throw error;
		}
	},
}));
