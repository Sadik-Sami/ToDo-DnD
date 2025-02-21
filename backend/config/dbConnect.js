const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`MongoDB Connected: ${conn.connection.host}`);

		// Create collections if they don't exist
		const db = conn.connection.db;
		const collections = await db.listCollections().toArray();
		const collectionNames = collections.map((col) => col.name);

		if (!collectionNames.includes('tasks')) {
			await db.createCollection('tasks');
			console.log('Tasks collection created');
		}

		if (!collectionNames.includes('users')) {
			await db.createCollection('users');
			console.log('Users collection created');
		}
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};

module.exports = connectDB;
