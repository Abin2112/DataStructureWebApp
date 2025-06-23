import express from 'express';

const router = express.Router();
let stacks = new Map(); // Store multiple stack instances

// Stack implementation
class Stack {
  constructor(id) {
    this.id = id;
    this.items = [];
    this.maxSize = 10;
  }

  push(element) {
    if (this.items.length >= this.maxSize) {
      throw new Error('Stack overflow');
    }
    this.items.push(element);
    return this.items;
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error('Stack underflow');
    }
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty');
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

// Create or get stack
router.post('/create/:id', (req, res) => {
  const { id } = req.params;
  const stack = new Stack(id);
  stacks.set(id, stack);
  res.json({ success: true, stack: stack.toArray(), message: 'Stack created' });
});

// Get stack state
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const stack = stacks.get(id);
  if (!stack) {
    return res.status(404).json({ error: 'Stack not found' });
  }
  res.json({ 
    stack: stack.toArray(), 
    size: stack.size(), 
    isEmpty: stack.isEmpty(),
    top: stack.isEmpty() ? null : stack.peek()
  });
});

// Push element
router.post('/:id/push', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const stack = stacks.get(id);
  
  if (!stack) {
    return res.status(404).json({ error: 'Stack not found' });
  }

  try {
    const result = stack.push(value);
    res.json({ 
      success: true, 
      stack: result, 
      message: `Pushed ${value}`,
      operation: 'push'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Pop element
router.post('/:id/pop', (req, res) => {
  const { id } = req.params;
  const stack = stacks.get(id);
  
  if (!stack) {
    return res.status(404).json({ error: 'Stack not found' });
  }

  try {
    const poppedValue = stack.pop();
    res.json({ 
      success: true, 
      stack: stack.toArray(), 
      poppedValue,
      message: `Popped ${poppedValue}`,
      operation: 'pop'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Peek
router.get('/:id/peek', (req, res) => {
  const { id } = req.params;
  const stack = stacks.get(id);
  
  if (!stack) {
    return res.status(404).json({ error: 'Stack not found' });
  }

  try {
    const topValue = stack.peek();
    res.json({ 
      success: true, 
      topValue,
      message: `Top element: ${topValue}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Clear stack
router.post('/:id/clear', (req, res) => {
  const { id } = req.params;
  const stack = stacks.get(id);
  
  if (!stack) {
    return res.status(404).json({ error: 'Stack not found' });
  }

  const result = stack.clear();
  res.json({ 
    success: true, 
    stack: result, 
    message: 'Stack cleared',
    operation: 'clear'
  });
});

export { router as stackRoutes };