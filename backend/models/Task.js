const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 50
  },
  description: {
    type: String,
    maxLength: 200
  },
  category: {
    type: String,
    required: true,
    enum: ['To-Do', 'In Progress', 'Done'],
    default: 'To-Do'
  },
  order: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
taskSchema.index({ userId: 1, category: 1 });
taskSchema.index({ order: 1 });

module.exports = mongoose.model('Task', taskSchema);