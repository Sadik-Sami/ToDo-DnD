import { useAuthStore } from '../stores/authStore';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
	const { loginWithGoogle, loading, error } = useAuthStore();

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
			<div className='max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
				<div className='text-center'>
					<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Task Manager</h1>
					<p className='mt-2 text-gray-600 dark:text-gray-300'>Sign in to manage your tasks</p>
				</div>

				{error && (
					<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>{error}</div>
				)}

				<button
					onClick={loginWithGoogle}
					disabled={loading}
					className={`w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 
            dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 
            text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
            disabled:opacity-50 disabled:cursor-not-allowed`}>
					{loading ? (
						<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-white'></div>
					) : (
						<>
							<FcGoogle className='w-5 h-5' />
							<span>Sign in with Google</span>
						</>
					)}
				</button>
			</div>
		</div>
	);
}
