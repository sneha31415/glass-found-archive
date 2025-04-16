const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  dateFound: {
    type: Date
  },
  dateLost: {
    type: Date
  },
  status: {
    type: String,
    enum: ['lost', 'found', 'claimed', 'returned', 'matched'],
    default: 'found'
  },
  imageUrl: {
    type: String
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reporterName: {
    type: String,
    required: true
  },
  reporterContact: {
    type: String,
    required: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  returnedDate: {
    type: Date
  },
  questions: [{
    id: String,
    question: String,
    answer: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', itemSchema); 