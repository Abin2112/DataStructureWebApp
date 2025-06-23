import express from 'express';
import cors from 'cors';
import { stackRoutes } from './routes/stack.js';
import { linkedListRoutes } from './routes/linkedList.js';
import { queueRoutes } from './routes/queue.js';
import { priorityQueueRoutes } from './routes/priorityQueue.js';
import { binaryTreeRoutes } from './routes/binaryTree.js';
import { graphRoutes } from './routes/graph.js';
import { hashTableRoutes } from './routes/hashTable.js';
import { huffmanRoutes } from './routes/huffman.js';
import { tspRoutes } from './routes/tsp.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stack', stackRoutes);
app.use('/api/linked-list', linkedListRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/priority-queue', priorityQueueRoutes);
app.use('/api/binary-tree', binaryTreeRoutes);
app.use('/api/graph', graphRoutes);
app.use('/api/hash-table', hashTableRoutes);
app.use('/api/huffman', huffmanRoutes);
app.use('/api/tsp', tspRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});