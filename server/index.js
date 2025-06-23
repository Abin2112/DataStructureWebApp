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

// --- CHANGE 1: Dynamic Port Configuration ---
// Render will provide the PORT variable. For local development, it falls back to 3001.
const PORT = process.env.PORT || 3001;

// --- CHANGE 2: Secure CORS Configuration ---
// Define the list of URLs that are allowed to make requests to this server.
const allowedOrigins = [
  'http://localhost:5173', // Your local React+Vite dev server
  'https://datastrcuturewebapp.netlify.app' // **REPLACE THIS** with your actual Netlify URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // The 'origin' is the URL of the site making the request (e.g., your Netlify app).
    // The check `!origin` allows for non-browser requests like from Postman or other tools.
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  }
};

// Middleware
app.use(cors(corsOptions)); // Use the more secure, configured CORS options
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
  // --- CHANGE 3: More generic and accurate console log ---
  console.log(`Server running on port ${PORT}`);
});
