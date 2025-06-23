import express from 'express';

const router = express.Router();
let priorityQueues = new Map();

// Priority Queue Node
class PriorityNode {
  constructor(data, priority) {
    this.data = data;
    this.priority = priority;
  }
}

// Priority Queue implementation
class PriorityQueue {
  constructor(id) {
    this.id = id;
    this.items = [];
    this.maxSize = 15;
  }

  enqueue(data, priority) {
    if (this.items.length >= this.maxSize) {
      throw new Error('Priority queue overflow');
    }
    
    const newNode = new PriorityNode(data, priority);
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (newNode.priority > this.items[i].priority) {
        this.items.splice(i, 0, newNode);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(newNode);
    }

    return this.toArray();
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Priority queue is empty');
    }
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) {
      throw new Error('Priority queue is empty');
    }
    return this.items[0];
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
    return this.items.map(item => ({
      data: item.data,
      priority: item.priority
    }));
  }
}

// Heap-based Priority Queue
class HeapPriorityQueue {
  constructor(id) {
    this.id = id;
    this.heap = [];
    this.maxSize = 15;
  }

  parent(i) { return Math.floor((i - 1) / 2); }
  leftChild(i) { return 2 * i + 1; }
  rightChild(i) { return 2 * i + 2; }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  enqueue(data, priority) {
    if (this.heap.length >= this.maxSize) {
      throw new Error('Heap overflow');
    }

    const node = new PriorityNode(data, priority);
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
    return this.toArray();
  }

  heapifyUp(index) {
    while (index > 0) {
      const parentIndex = this.parent(index);
      if (this.heap[index].priority <= this.heap[parentIndex].priority) {
        break;
      }
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Heap is empty');
    }

    const root = this.heap[0];
    const lastElement = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = lastElement;
      this.heapifyDown(0);
    }

    return root;
  }

  heapifyDown(index) {
    while (this.leftChild(index) < this.heap.length) {
      let maxChildIndex = this.leftChild(index);
      
      if (this.rightChild(index) < this.heap.length &&
          this.heap[this.rightChild(index)].priority > this.heap[maxChildIndex].priority) {
        maxChildIndex = this.rightChild(index);
      }

      if (this.heap[index].priority >= this.heap[maxChildIndex].priority) {
        break;
      }

      this.swap(index, maxChildIndex);
      index = maxChildIndex;
    }
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error('Heap is empty');
    }
    return this.heap[0];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  size() {
    return this.heap.length;
  }

  clear() {
    this.heap = [];
    return this.heap;
  }

  toArray() {
    return this.heap.map((item, index) => ({
      data: item.data,
      priority: item.priority,
      index: index
    }));
  }
}

// Create priority queue
router.post('/create/:id', (req, res) => {
  const { id } = req.params;
  const pq = new PriorityQueue(id);
  priorityQueues.set(id, pq);
  res.json({ success: true, queue: pq.toArray(), message: 'Priority queue created' });
});

// Create heap priority queue
router.post('/heap/create/:id', (req, res) => {
  const { id } = req.params;
  const heapPQ = new HeapPriorityQueue(id);
  priorityQueues.set(`heap-${id}`, heapPQ);
  res.json({ success: true, queue: heapPQ.toArray(), message: 'Heap priority queue created' });
});

// Priority queue operations
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const pq = priorityQueues.get(id);
  if (!pq) {
    return res.status(404).json({ error: 'Priority queue not found' });
  }
  res.json({ 
    queue: pq.toArray(), 
    size: pq.size(), 
    isEmpty: pq.isEmpty()
  });
});

router.post('/:id/enqueue', (req, res) => {
  const { id } = req.params;
  const { value, priority } = req.body;
  const pq = priorityQueues.get(id);
  
  if (!pq) {
    return res.status(404).json({ error: 'Priority queue not found' });
  }

  try {
    const result = pq.enqueue(value, priority);
    res.json({ 
      success: true, 
      queue: result, 
      message: `Enqueued ${value} with priority ${priority}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/dequeue', (req, res) => {
  const { id } = req.params;
  const pq = priorityQueues.get(id);
  
  if (!pq) {
    return res.status(404).json({ error: 'Priority queue not found' });
  }

  try {
    const dequeued = pq.dequeue();
    res.json({ 
      success: true, 
      queue: pq.toArray(), 
      dequeuedValue: dequeued,
      message: `Dequeued ${dequeued.data} (priority: ${dequeued.priority})`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Heap priority queue operations
router.get('/heap/:id', (req, res) => {
  const { id } = req.params;
  const heapPQ = priorityQueues.get(`heap-${id}`);
  if (!heapPQ) {
    return res.status(404).json({ error: 'Heap priority queue not found' });
  }
  res.json({ 
    queue: heapPQ.toArray(), 
    size: heapPQ.size(), 
    isEmpty: heapPQ.isEmpty()
  });
});

router.post('/heap/:id/enqueue', (req, res) => {
  const { id } = req.params;
  const { value, priority } = req.body;
  const heapPQ = priorityQueues.get(`heap-${id}`);
  
  if (!heapPQ) {
    return res.status(404).json({ error: 'Heap priority queue not found' });
  }

  try {
    const result = heapPQ.enqueue(value, priority);
    res.json({ 
      success: true, 
      queue: result, 
      message: `Enqueued ${value} with priority ${priority}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/heap/:id/dequeue', (req, res) => {
  const { id } = req.params;
  const heapPQ = priorityQueues.get(`heap-${id}`);
  
  if (!heapPQ) {
    return res.status(404).json({ error: 'Heap priority queue not found' });
  }

  try {
    const dequeued = heapPQ.dequeue();
    res.json({ 
      success: true, 
      queue: heapPQ.toArray(), 
      dequeuedValue: dequeued,
      message: `Dequeued ${dequeued.data} (priority: ${dequeued.priority})`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export { router as priorityQueueRoutes };