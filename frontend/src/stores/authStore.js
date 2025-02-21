import { create } from 'zustand';
import { auth } from '../config/firebase';
import {
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	onAuthStateChanged,
	setPersistence,
	browserLocalPersistence,
} from 'firebase/auth';
import axios from 'axios';

const provider = new GoogleAuthProvider();

// Set persistence to LOCAL (survives browser restart)
setPersistence(auth, browserLocalPersistence);

export const useAuthStore = create((set) => ({
	user: null,
	loading: true, // Start with loading true
	error: null,

	initAuth: () => {
		// Set up auth state listener
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				try {
					// Save/update user in database
					await axios.post('http://localhost:5000/api/users', {
						uid: user.uid,
						email: user.email,
						displayName: user.displayName,
					});
				} catch (error) {
					console.error('Error saving user to database:', error);
				}
			}
			set({ user, loading: false });
		});

		// Return unsubscribe function for cleanup
		return unsubscribe;
	},

	loginWithGoogle: async () => {
		try {
			set({ loading: true, error: null });
			const result = await signInWithPopup(auth, provider);

			// User will be set by onAuthStateChanged listener
		} catch (error) {
			set({ error: error.message, loading: false });
		}
	},

	logout: async () => {
		try {
			await signOut(auth);
			// User will be set to null by onAuthStateChanged listener
		} catch (error) {
			set({ error: error.message });
		}
	},
}));
