import express from 'express';

const router = express.Router();
let graphs = new Map();

// Graph implementation
class Graph {
  constructor(id, directed = false) {
    this.id = id;
    this.directed = directed;
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
    return this.getGraphStructure();
  }

  addEdge(vertex1, vertex2, weight = 1) {
    if (!this.adjacencyList.has(vertex1)) {
      this.addVertex(vertex1);
    }
    if (!this.adjacencyList.has(vertex2)) {
      this.addVertex(vertex2);
    }

    this.adjacencyList.get(vertex1).push({ node: vertex2, weight });
    
    if (!this.directed) {
      this.adjacencyList.get(vertex2).push({ node: vertex1, weight });
    }

    return this.getGraphStructure();
  }

  removeVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      return this.getGraphStructure();
    }

    // Remove all edges to this vertex
    for (let [key, edges] of this.adjacencyList) {
      this.adjacencyList.set(key, edges.filter(edge => edge.node !== vertex));
    }

    // Remove the vertex itself
    this.adjacencyList.delete(vertex);
    return this.getGraphStructure();
  }

  removeEdge(vertex1, vertex2) {
    if (this.adjacencyList.has(vertex1)) {
      this.adjacencyList.set(
        vertex1,
        this.adjacencyList.get(vertex1).filter(edge => edge.node !== vertex2)
      );
    }

    if (!this.directed && this.adjacencyList.has(vertex2)) {
      this.adjacencyList.set(
        vertex2,
        this.adjacencyList.get(vertex2).filter(edge => edge.node !== vertex1)
      );
    }

    return this.getGraphStructure();
  }

  bfs(startVertex) {
    if (!this.adjacencyList.has(startVertex)) {
      return { visited: [], path: [] };
    }

    const visited = new Set();
    const queue = [startVertex];
    const result = [];
    const path = [];

    while (queue.length > 0) {
      const vertex = queue.shift();
      
      if (!visited.has(vertex)) {
        visited.add(vertex);
        result.push(vertex);
        
        const neighbors = this.adjacencyList.get(vertex) || [];
        for (let edge of neighbors) {
          if (!visited.has(edge.node)) {
            queue.push(edge.node);
            path.push({ from: vertex, to: edge.node });
          }
        }
      }
    }

    return { visited: result, path };
  }

  dfs(startVertex) {
    if (!this.adjacencyList.has(startVertex)) {
      return { visited: [], path: [] };
    }

    const visited = new Set();
    const result = [];
    const path = [];

    const dfsHelper = (vertex) => {
      visited.add(vertex);
      result.push(vertex);

      const neighbors = this.adjacencyList.get(vertex) || [];
      for (let edge of neighbors) {
        if (!visited.has(edge.node)) {
          path.push({ from: vertex, to: edge.node });
          dfsHelper(edge.node);
        }
      }
    };

    dfsHelper(startVertex);
    return { visited: result, path };
  }

  // Dijkstra's shortest path algorithm
  dijkstra(startVertex) {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

    // Initialize distances
    for (let vertex of this.adjacencyList.keys()) {
      distances.set(vertex, vertex === startVertex ? 0 : Infinity);
      previous.set(vertex, null);
      unvisited.add(vertex);
    }

    while (unvisited.size > 0) {
      // Find unvisited vertex with minimum distance
      let current = null;
      let minDistance = Infinity;
      
      for (let vertex of unvisited) {
        if (distances.get(vertex) < minDistance) {
          minDistance = distances.get(vertex);
          current = vertex;
        }
      }

      if (current === null || minDistance === Infinity) break;

      unvisited.delete(current);

      // Update distances to neighbors
      const neighbors = this.adjacencyList.get(current) || [];
      for (let edge of neighbors) {
        if (unvisited.has(edge.node)) {
          const newDistance = distances.get(current) + edge.weight;
          if (newDistance < distances.get(edge.node)) {
            distances.set(edge.node, newDistance);
            previous.set(edge.node, current);
          }
        }
      }
    }

    // Convert to array format
    const result = [];
    for (let [vertex, distance] of distances) {
      result.push({ vertex, distance, previous: previous.get(vertex) });
    }

    return result;
  }

  getGraphStructure() {
    const vertices = Array.from(this.adjacencyList.keys());
    const edges = [];

    for (let [vertex, neighbors] of this.adjacencyList) {
      for (let edge of neighbors) {
        // Avoid duplicate edges in undirected graphs
        if (!this.directed && vertex > edge.node) continue;
        edges.push({
          from: vertex,
          to: edge.node,
          weight: edge.weight
        });
      }
    }

    return {
      vertices,
      edges,
      directed: this.directed,
      adjacencyList: Object.fromEntries(this.adjacencyList)
    };
  }

  clear() {
    this.adjacencyList.clear();
    return this.getGraphStructure();
  }
}

// Create graph
router.post('/create/:id', (req, res) => {
  const { id } = req.params;
  const { directed = false } = req.body;
  const graph = new Graph(id, directed);
  graphs.set(id, graph);
  res.json({ 
    success: true, 
    graph: graph.getGraphStructure(), 
    message: `${directed ? 'Directed' : 'Undirected'} graph created` 
  });
});

// Get graph structure
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const graph = graphs.get(id);
  if (!graph) {
    return res.status(404).json({ error: 'Graph not found' });
  }
  res.json({ graph: graph.getGraphStructure() });
});

// Add vertex
router.post('/:id/vertex', (req, res) => {
  const { id } = req.params;
  const { vertex } = req.body;
  const graph = graphs.get(id);
  
  if (!graph) {
    return res.status(404).json({ error: 'Graph not found' });
  }

  const result = graph.addVertex(vertex);
  res.json({ 
    success: true, 
    graph: result, 
    message: `Added vertex ${vertex}`
  });
});

// Add edge
router.post('/:id/edge', (req, res) => {
  const { id } = req.params;
  const { from, to, weight = 1 } = req.body;
  const graph = graphs.get(id);
  
  if (!graph) {
    return res.status(404).json({ error: 'Graph not found' });
  }

  const result = graph.addEdge(from, to, weight);
  res.json({ 
    success: true, 
    graph: result, 
    message: `Added edge from ${from} to ${to} with weight ${weight}`
  });
});

// Remove vertex
router.delete('/:id/vertex/:vertex', (req, res) => {
  const { id, vertex } = req.params;
  const graph = graphs.get(id);
  
  if (!graph) {
    return res.status(404).json({ error: 'Graph not found' });
  }

  const result = graph.removeVertex(vertex);
  res.json({ 
    success: true, 
    graph: result, 
    message: `Removed vertex ${vertex}`
  });
});

// BFS traversal
router.post('/:id/bfs', (req, res) => {
  const { id } = req.params;
  const { startVertex } = req.body;
  const graph = graphs.get(id);
  
  if (!graph) {
    return res.status(404).json({ error: 'Graph not found' });
  }

  const result = graph.bfs(startVertex);
  res.json({ 
    success: true, 
    traversal: result,
    message: `BFS traversal from ${startVertex}`
  });
});

// DFS traversal
router.post('/:id/dfs', (req, res) => {
  const { id } = req.params;
  const { startVertex } = req.body;
  const graph = graphs.get(id);
  
  if (!graph) {
    return res.status(404).json({ error: 'Graph not found' });
  }

  const result = graph.dfs(startVertex);
  res.json({ 
    success: true, 
    traversal: result,
    message: `DFS traversal from ${startVertex}`
  });
});

// Dijkstra's algorithm
router.post('/:id/dijkstra', (req, res) => {
  const { id } = req.params;
  const { startVertex } = req.body;
  const graph = graphs.get(id);
  
  if (!graph) {
    return res.status(404).json({ error: 'Graph not found' });
  }

  const result = graph.dijkstra(startVertex);
  res.json({ 
    success: true, 
    shortestPaths: result,
    message: `Shortest paths from ${startVertex}`
  });
});

export { router as graphRoutes };