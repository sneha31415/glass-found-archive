const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find()
      .populate('reportedBy', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get items by status
router.get('/status/:status', async (req, res) => {
  try {
    const items = await Item.find({ status: req.params.status })
      .populate('reportedBy', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new item
router.post('/', auth, async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      reportedBy: req.user.id,
      status: req.body.status || 'found'
    });

    const item = await newItem.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is the owner or admin
    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Claim item
router.put('/:id/claim', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update status and claimedBy
    item.status = 'claimed';
    item.claimedBy = req.user.id;
    item.updatedAt = new Date();

    await item.save();
    res.json(item);
  } catch (error) {
    console.error('Error claiming item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is the owner or admin
    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 