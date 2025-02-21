import { useState } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { X } from 'react-feather';

export default function AddTaskModal({ isOpen, onClose }) {
	const { addTask } = useTaskStore();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('To-Do');

	const handleSubmit = async (e) => {
		e.preventDefault();
		await addTask({
			title,
			description,
			category,
		});
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
			<div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-semibold text-gray-900 dark:text-white'>Add New Task</h2>
					<button onClick={onClose} className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'>
						<X />
					</button>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Title</label>
						<input
							type='text'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							maxLength={50}
							required
							className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Description</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							maxLength={200}
							className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Category</label>
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'>
							<option value='To-Do'>To-Do</option>
							<option value='In Progress'>In Progress</option>
							<option value='Done'>Done</option>
						</select>
					</div>

					<div className='flex justify-end gap-2'>
						<button
							type='button'
							onClick={onClose}
							className='px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded'>
							Cancel
						</button>
						<button type='submit' className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'>
							Add Task
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
