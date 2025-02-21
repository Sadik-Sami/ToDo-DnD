import { useState } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { Edit2, Trash2 } from 'react-feather';
import { format } from 'date-fns';

export default function TaskCard({ task }) {
	const { updateTask, deleteTask } = useTaskStore();
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task.description);

	const handleSave = () => {
		updateTask(task._id, { title, description });
		setIsEditing(false);
	};

	return (
		<div className='bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600'>
			{isEditing ? (
				<div className='space-y-3'>
					<input
						type='text'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className='w-full p-2 border rounded'
						maxLength={50}
					/>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className='w-full p-2 border rounded'
						maxLength={200}
					/>
					<div className='flex justify-end gap-2'>
						<button
							onClick={() => setIsEditing(false)}
							className='px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded'>
							Cancel
						</button>
						<button
							onClick={handleSave}
							className='px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700'>
							Save
						</button>
					</div>
				</div>
			) : (
				<>
					<div className='flex justify-between items-start mb-2'>
						<h3 className='font-medium text-gray-900 dark:text-white'>{task.title}</h3>
						<div className='flex gap-2'>
							<button
								onClick={() => setIsEditing(true)}
								className='p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded'>
								<Edit2 size={16} />
							</button>
							<button
								onClick={() => deleteTask(task._id)}
								className='p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-red-500'>
								<Trash2 size={16} />
							</button>
						</div>
					</div>
					<p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>{task.description}</p>
					<p className='text-xs text-gray-500 dark:text-gray-400'>{format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
				</>
			)}
		</div>
	);
}
