import React, { useState, useEffect } from 'react';
import { Plus, Minus, Search, Trash2, AlertCircle, Network, Route } from 'lucide-react';

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

interface GraphState {
  vertices: string[];
  edges: GraphEdge[];
  directed: boolean;
  adjacencyList: Record<string, any[]>;
}

interface TraversalResult {
  visited: string[];
  path: { from: string; to: string }[];
}

export function GraphVisualizer() {
  const [graphState, setGraphState] = useState<GraphState>({
    vertices: [],
    edges: [],
    directed: false,
    adjacencyList: {}
  });
  const [vertexInput, setVertexInput] = useState('');
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('1');
  const [traversalStart, setTraversalStart] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [traversalResult, setTraversalResult] = useState<{ type: string; result: TraversalResult } | null>(null);
  const [shortestPaths, setShortestPaths] = useState<any[] | null>(null);

  useEffect(() => {
    initializeGraph();
  }, []);

  const initializeGraph = async () => {
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/graph/create/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directed: false })
      });
      const data = await response.json();
      setMessage(data.message);
      await fetchGraphState();
    } catch (error) {
      setMessage('Failed to initialize graph');
    }
  };

  const fetchGraphState = async () => {
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/graph/demo');
      const data = await response.json();
      setGraphState(data.graph);
    } catch (error) {
      setMessage('Failed to fetch graph state');
    }
  };

  const handleAddVertex = async () => {
    if (!vertexInput.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/graph/demo/vertex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vertex: vertexInput.trim() })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setVertexInput('');
        await fetchGraphState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to add vertex');
    }
    setIsLoading(false);
  };

  const handleAddEdge = async () => {
    if (!edgeFrom.trim() || !edgeTo.trim()) return;
    
    const weight = parseInt(edgeWeight) || 1;
    setIsLoading(true);
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/graph/demo/edge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: edgeFrom.trim(), to: edgeTo.trim(), weight })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setEdgeFrom('');
        setEdgeTo('');
        setEdgeWeight('1');
        await fetchGraphState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to add edge');
    }
    setIsLoading(false);
  };

  const handleTraversal = async (type: 'bfs' | 'dfs') => {
    if (!traversalStart.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://datastructurewebapp.onrender.com/api/graph/demo/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startVertex: traversalStart.trim() })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setTraversalResult({ type: type.toUpperCase(), result: data.traversal });
        setShortestPaths(null);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage(`Failed to perform ${type.toUpperCase()}`);
    }
    setIsLoading(false);
  };

  const handleDijkstra = async () => {
    if (!traversalStart.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/graph/demo/dijkstra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startVertex: traversalStart.trim() })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setShortestPaths(data.shortestPaths);
        setTraversalResult(null);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to run Dijkstra\'s algorithm');
    }
    setIsLoading(false);
  };

  const getVertexPosition = (vertex: string, index: number, total: number) => {
    const angle = (2 * Math.PI * index) / total;
    const radius = Math.min(150, 50 + total * 10);
    const centerX = 200;
    const centerY = 200;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const isVertexInTraversal = (vertex: string) => {
    return traversalResult?.result.visited.includes(vertex) || false;
  };

  const isEdgeInTraversal = (from: string, to: string) => {
    if (!traversalResult) return false;
    return traversalResult.result.path.some(p => 
      (p.from === from && p.to === to) || (!graphState.directed && p.from === to && p.to === from)
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Graph Visualizer</h2>
        
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Vertex
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={vertexInput}
                  onChange={(e) => setVertexInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddVertex()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Vertex name..."
                  disabled={isLoading}
                />
                <button
                  onClick={handleAddVertex}
                  disabled={!vertexInput.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Edge
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={edgeFrom}
                    onChange={(e) => setEdgeFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="From vertex..."
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    value={edgeTo}
                    onChange={(e) => setEdgeTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="To vertex..."
                    disabled={isLoading}
                  />
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Weight"
                    disabled={isLoading}
                    min="1"
                  />
                  <button
                    onClick={handleAddEdge}
                    disabled={!edgeFrom.trim() || !edgeTo.trim() || isLoading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Network className="h-4 w-4" />
                    <span>Add Edge</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graph Algorithms
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={traversalStart}
                  onChange={(e) => setTraversalStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Start vertex..."
                  disabled={isLoading}
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleTraversal('bfs')}
                    disabled={!traversalStart.trim() || isLoading || graphState.vertices.length === 0}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
                  >
                    BFS
                  </button>
                  <button
                    onClick={() => handleTraversal('dfs')}
                    disabled={!traversalStart.trim() || isLoading || graphState.vertices.length === 0}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
                  >
                    DFS
                  </button>
                </div>
                <button
                  onClick={handleDijkstra}
                  disabled={!traversalStart.trim() || isLoading || graphState.vertices.length === 0}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
                >
                  <Route className="h-4 w-4" />
                  <span>Dijkstra's Algorithm</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Graph Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-semibold">{graphState.directed ? 'Directed' : 'Undirected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vertices:</span>
                <span className="font-mono font-semibold">{graphState.vertices.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Edges:</span>
                <span className="font-mono font-semibold">{graphState.edges.length}</span>
              </div>
              {traversalResult && (
                <div className="mt-3 p-2 bg-white rounded border">
                  <div className="text-xs font-semibold text-gray-700 mb-1">
                    {traversalResult.type} Traversal:
                  </div>
                  <div className="text-sm font-mono text-purple-600">
                    {traversalResult.result.visited.join(' → ')}
                  </div>
                </div>
              )}
              {shortestPaths && (
                <div className="mt-3 p-2 bg-white rounded border max-h-32 overflow-y-auto">
                  <div className="text-xs font-semibold text-gray-700 mb-1">
                    Shortest Paths:
                  </div>
                  {shortestPaths.map((path, index) => (
                    <div key={index} className="text-xs text-orange-600">
                      {path.vertex}: {path.distance === Infinity ? '∞' : path.distance}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800">{message}</span>
          </div>
        )}

        {/* Graph Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Graph Structure</h3>
          
          <div className="flex justify-center">
            {graphState.vertices.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                Graph is empty. Add vertices and edges to see the visualization.
              </div>
            ) : (
              <div className="relative">
                <svg width="400" height="400" className="border border-gray-200 rounded-lg bg-white">
                  {/* Render edges */}
                  {graphState.edges.map((edge, index) => {
                    const fromIndex = graphState.vertices.indexOf(edge.from);
                    const toIndex = graphState.vertices.indexOf(edge.to);
                    const fromPos = getVertexPosition(edge.from, fromIndex, graphState.vertices.length);
                    const toPos = getVertexPosition(edge.to, toIndex, graphState.vertices.length);
                    
                    const isHighlighted = isEdgeInTraversal(edge.from, edge.to);
                    
                    return (
                      <g key={`edge-${index}`}>
                        <line
                          x1={fromPos.x}
                          y1={fromPos.y}
                          x2={toPos.x}
                          y2={toPos.y}
                          stroke={isHighlighted ? '#8B5CF6' : '#9CA3AF'}
                          strokeWidth={isHighlighted ? 3 : 2}
                          className="transition-all duration-500"
                        />
                        {/* Edge weight */}
                        <text
                          x={(fromPos.x + toPos.x) / 2}
                          y={(fromPos.y + toPos.y) / 2}
                          textAnchor="middle"
                          className="text-xs fill-gray-600 font-semibold"
                          dy="0.3em"
                        >
                          {edge.weight}
                        </text>
                        {/* Arrow for directed graphs */}
                        {graphState.directed && (
                          <polygon
                            points={`${toPos.x - 5},${toPos.y - 5} ${toPos.x + 5},${toPos.y - 5} ${toPos.x},${toPos.y + 5}`}
                            fill={isHighlighted ? '#8B5CF6' : '#9CA3AF'}
                            className="transition-all duration-500"
                          />
                        )}
                      </g>
                    );
                  })}
                  
                  {/* Render vertices */}
                  {graphState.vertices.map((vertex, index) => {
                    const pos = getVertexPosition(vertex, index, graphState.vertices.length);
                    const isHighlighted = isVertexInTraversal(vertex);
                    const isStart = vertex === traversalStart;
                    
                    return (
                      <g key={`vertex-${index}`}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="20"
                          fill={isStart ? '#F59E0B' : isHighlighted ? '#8B5CF6' : '#3B82F6'}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          className="transition-all duration-500"
                        />
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor="middle"
                          className="text-sm font-semibold fill-white"
                          dy="0.3em"
                        >
                          {vertex}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>

          {graphState.vertices.length > 0 && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Normal Vertex</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Start Vertex</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Visited/Path</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Operations Guide */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Graph Algorithms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-purple-700 mb-1">BFS (Breadth-First Search)</div>
              <div className="text-gray-600">Explores neighbors level by level, finds shortest path in unweighted graphs</div>
            </div>
            <div>
              <div className="font-semibold text-indigo-700 mb-1">DFS (Depth-First Search)</div>
              <div className="text-gray-600">Explores as far as possible before backtracking</div>
            </div>
            <div>
              <div className="font-semibold text-orange-700 mb-1">Dijkstra's Algorithm</div>
              <div className="text-gray-600">Finds shortest paths from source to all vertices in weighted graphs</div>
            </div>
            <div>
              <div className="font-semibold text-green-700 mb-1">Graph Properties</div>
              <div className="text-gray-600">Undirected graph with weighted edges for demonstration</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
