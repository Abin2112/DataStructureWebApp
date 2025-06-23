import express from 'express';

const router = express.Router();
let queues = new Map();

// Queue implementation
class Queue {
  constructor(id) {
    this.id = id;
    this.items = [];
    this.maxSize = 10;
  }

  enqueue(element) {
    if (this.items.length >= this.maxSize) {
      throw new Error('Queue overflow');
    }
    this.items.push(element);
    return this.items;
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Queue underflow');
    }
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty');
    }
    return this.items[0];
  }

  rear() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty');
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
    return this.items;
  }

  toArray() {
    return [...this.items];
  }
}

// Create queue
router.post('/create/:id', (req, res) => {
  const { id } = req.params;
  const queue = new Queue(id);
  queues.set(id, queue);
  res.json({ success: true, queue: queue.toArray(), message: 'Queue created' });
});

// Get queue state
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const queue = queues.get(id);
  if (!queue) {
    return res.status(404).json({ error: 'Queue not found' });
  }
  res.json({ 
    queue: queue.toArray(), 
    size: queue.size(), 
    isEmpty: queue.isEmpty(),
    front: queue.isEmpty() ? null : queue.front(),
    rear: queue.isEmpty() ? null : queue.rear()
  });
});

// Enqueue element
router.post('/:id/enqueue', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const queue = queues.get(id);
  
  if (!queue) {
    return res.status(404).json({ error: 'Queue not found' });
  }

  try {
    const result = queue.enqueue(value);
    res.json({ 
      success: true, 
      queue: result, 
      message: `Enqueued ${value}`,
      operation: 'enqueue'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Dequeue element
router.post('/:id/dequeue', (req, res) => {
  const { id } = req.params;
  const queue = queues.get(id);
  
  if (!queue) {
    return res.status(404).json({ error: 'Queue not found' });
  }

  try {
    const dequeuedValue = queue.dequeue();
    res.json({ 
      success: true, 
      queue: queue.toArray(), 
      dequeuedValue,
      message: `Dequeued ${dequeuedValue}`,
      operation: 'dequeue'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Clear queue
router.post('/:id/clear', (req, res) => {
  const { id } = req.params;
  const queue = queues.get(id);
  
  if (!queue) {
    return res.status(404).json({ error: 'Queue not found' });
  }

  const result = queue.clear();
  res.json({ 
    success: true, 
    queue: result, 
    message: 'Queue cleared',
    operation: 'clear'
  });
});

export { router as queueRoutes };