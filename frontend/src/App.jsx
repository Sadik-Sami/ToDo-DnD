import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
	const { user, loading, initAuth } = useAuthStore();

	useEffect(() => {
		const unsubscribe = initAuth();
		return () => unsubscribe(); // Cleanup on unmount
	}, [initAuth]);

	if (loading) {
		return (
			<div className='h-screen w-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
			</div>
		);
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
				<Route path='/' element={user ? <Dashboard /> : <Navigate to='/login' />} />
			</Routes>
			<Toaster position='bottom-right' />
		</BrowserRouter>
	);
}

export default App;
