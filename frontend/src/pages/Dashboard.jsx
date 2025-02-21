import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTaskStore } from '../stores/taskStore';
import { useAuthStore } from '../stores/authStore';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import { Moon, Sun, LogOut } from 'react-feather';

const categories = ['To-Do', 'In Progress', 'Done'];

export default function Dashboard() {
	const { tasks, fetchTasks, reorderTasks, initializeSocketListeners } = useTaskStore();
	const { logout } = useAuthStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		fetchTasks();
		initializeSocketListeners(); // Initialize socket listeners
	}, [fetchTasks, initializeSocketListeners]);

	useEffect(() => {
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [isDark]);

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>
			<div className='container mx-auto px-4 py-8'>
				<div className='flex justify-between items-center mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Task Management</h1>
					<div className='flex items-center gap-4'>
						<button
							onClick={() => setIsDark(!isDark)}
							className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'>
							{isDark ? <Sun className='text-white' /> : <Moon />}
						</button>
						<button onClick={logout} className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'>
							<LogOut />
						</button>
					</div>
				</div>

				<button
					onClick={() => setIsModalOpen(true)}
					className='mb-8 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'>
					Add New Task
				</button>

				<DragDropContext onDragEnd={reorderTasks}>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{categories.map((category) => (
							<div key={category} className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4'>
								<h2 className='text-lg font-semibold mb-4 text-gray-900 dark:text-white'>{category}</h2>
								<Droppable droppableId={category}>
									{(provided) => (
										<div ref={provided.innerRef} {...provided.droppableProps} className='space-y-4'>
											{tasks
												.filter((task) => task.category === category)
												.map((task, index) => (
													<Draggable key={task._id} draggableId={task._id} index={index}>
														{(provided) => (
															<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
																<TaskCard task={task} />
															</div>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</div>
						))}
					</div>
				</DragDropContext>
			</div>

			{isModalOpen && <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
		</div>
	);
}
