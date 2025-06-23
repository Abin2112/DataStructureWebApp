import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, AlertCircle, Star } from 'lucide-react';

interface PriorityNode {
  data: any;
  priority: number;
  index?: number;
}

interface PriorityQueueVisualizerProps {
  type: 'basic' | 'heap';
}

export function PriorityQueueVisualizer({ type }: PriorityQueueVisualizerProps) {
  const [queueState, setQueueState] = useState<{ queue: PriorityNode[]; size: number; isEmpty: boolean }>({
    queue: [],
    size: 0,
    isEmpty: true
  });
  const [inputValue, setInputValue] = useState('');
  const [priorityValue, setPriorityValue] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastOperation, setLastOperation] = useState<string | null>(null);

  useEffect(() => {
    initializeQueue();
  }, [type]);

  const initializeQueue = async () => {
    try {
      const endpoint = type === 'heap' ? 'heap/create' : 'create';
      const response = await fetch(`https://datastructurewebapp.onrender.com/api/priority-queue/${endpoint}/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setMessage(data.message);
      await fetchQueueState();
    } catch (error) {
      setMessage('Failed to initialize priority queue');
    }
  };

  const fetchQueueState = async () => {
    try {
      const endpoint = type === 'heap' ? 'heap/demo' : 'demo';
      const response = await fetch(`https://datastructurewebapp.onrender.com/api/priority-queue/${endpoint}`);
      const data = await response.json();
      setQueueState(data);
    } catch (error) {
      setMessage('Failed to fetch queue state');
    }
  };

  const handleEnqueue = async () => {
    if (!inputValue.trim() || !priorityValue.trim()) return;
    
    const priority = parseInt(priorityValue);
    if (isNaN(priority)) {
      setMessage('Priority must be a number');
      return;
    }

    setIsLoading(true);
    setLastOperation('enqueue');
    try {
      const endpoint = type === 'heap' ? 'heap/demo/enqueue' : 'demo/enqueue';
      const response = await fetch(`https://datastructurewebapp.onrender.com/api/priority-queue/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: inputValue.trim(), priority })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setInputValue('');
        setPriorityValue('');
        await fetchQueueState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to enqueue element');
    }
    setIsLoading(false);
    setTimeout(() => setLastOperation(null), 1000);
  };

  const handleDequeue = async () => {
    setIsLoading(true);
    setLastOperation('dequeue');
    try {
      const endpoint = type === 'heap' ? 'heap/demo/dequeue' : 'demo/dequeue';
      const response = await fetch(`https://datastructurewebapp.onrender.com/api/priority-queue/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        await fetchQueueState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to dequeue element');
    }
    setIsLoading(false);
    setTimeout(() => setLastOperation(null), 1000);
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 border-red-300 text-red-800';
    if (priority >= 6) return 'bg-orange-100 border-orange-300 text-orange-800';
    if (priority >= 4) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    if (priority >= 2) return 'bg-green-100 border-green-300 text-green-800';
    return 'bg-blue-100 border-blue-300 text-blue-800';
  };

  const renderHeapVisualization = () => {
    if (queueState.queue.length === 0) return null;

    const levels: PriorityNode[][] = [];
    let levelIndex = 0;
    let levelSize = 1;
    let currentIndex = 0;

    while (currentIndex < queueState.queue.length) {
      const level: PriorityNode[] = [];
      for (let i = 0; i < levelSize && currentIndex < queueState.queue.length; i++) {
        level.push(queueState.queue[currentIndex]);
        currentIndex++;
      }
      levels.push(level);
      levelSize *= 2;
      levelIndex++;
    }

    return (
      <div className="flex flex-col items-center space-y-4">
        {levels.map((level, levelIdx) => (
          <div key={levelIdx} className="flex justify-center space-x-4">
            {level.map((node, nodeIdx) => (
              <div
                key={`${node.data}-${node.index}`}
                className={`
                  w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 font-mono text-sm
                  ${getPriorityColor(node.priority)}
                  transition-all duration-500
                `}
              >
                <div className="font-semibold">{node.data}</div>
                <div className="text-xs">({node.priority})</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {type === 'heap' ? 'Heap' : 'Basic'} Priority Queue Visualizer
        </h2>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Element and Priority
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter value..."
                  disabled={isLoading}
                />
                <input
                  type="number"
                  value={priorityValue}
                  onChange={(e) => setPriorityValue(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Priority"
                  disabled={isLoading}
                  min="0"
                  max="10"
                />
              </div>
              <button
                onClick={handleEnqueue}
                disabled={!inputValue.trim() || !priorityValue.trim() || isLoading}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Enqueue with Priority</span>
              </button>
              <div className="text-xs text-gray-600 mt-1">
                Higher numbers = Higher priority (0-10)
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleDequeue}
                disabled={queueState.isEmpty || isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
              >
                <Minus className="h-4 w-4" />
                <span>Dequeue (Highest Priority)</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Priority Queue Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-semibold">{type === 'heap' ? 'Max Heap' : 'Array-based'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="font-mono font-semibold">{queueState.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Highest Priority:</span>
                <span className="font-mono font-semibold">
                  {queueState.queue.length > 0 
                    ? `${queueState.queue[0].data} (${queueState.queue[0].priority})`
                    : 'None'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${queueState.isEmpty ? 'text-gray-500' : 'text-purple-600'}`}>
                  {queueState.isEmpty ? 'Empty' : 'Has Elements'}
                </span>
              </div>
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

        {/* Priority Queue Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {type === 'heap' ? 'Max Heap Structure' : 'Priority Queue Structure'}
          </h3>
          
          <div className="flex flex-col items-center space-y-4">
            {queueState.queue.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                Priority queue is empty. Add elements with priorities to see the visualization.
              </div>
            ) : (
              <>
                {type === 'heap' ? (
                  renderHeapVisualization()
                ) : (
                  <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
                    {queueState.queue.map((node, index) => {
                      const isHighestPriority = index === 0;
                      const isAnimated = lastOperation === 'enqueue' && index === queueState.queue.length - 1;
                      
                      return (
                        <div
                          key={`${node.data}-${index}`}
                          className={`
                            relative w-20 h-16 flex flex-col items-center justify-center rounded-lg border-2 font-mono text-sm
                            ${getPriorityColor(node.priority)}
                            ${isHighestPriority ? 'ring-2 ring-purple-400' : ''}
                            transition-all duration-500 transform
                            ${isAnimated ? 'scale-110' : 'scale-100'}
                          `}
                        >
                          {isHighestPriority && (
                            <Star className="absolute -top-2 -right-2 h-4 w-4 text-purple-600 fill-current" />
                          )}
                          <div className="font-semibold">{node.data}</div>
                          <div className="text-xs">P: {node.priority}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="text-center mt-4">
                  <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-200 rounded"></div>
                      <span>High Priority (8-10)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-orange-200 rounded"></div>
                      <span>Medium-High (6-7)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                      <span>Medium (4-5)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-200 rounded"></div>
                      <span>Low-Medium (2-3)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-200 rounded"></div>
                      <span>Low (0-1)</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Operations Guide */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {type === 'heap' ? 'Heap' : 'Basic'} Priority Queue Operations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-purple-700 mb-1">Enqueue</div>
              <div className="text-gray-600">
                Add element with priority. {type === 'heap' ? 'Maintains heap property.' : 'Inserts in priority order.'}
              </div>
            </div>
            <div>
              <div className="font-semibold text-red-700 mb-1">Dequeue</div>
              <div className="text-gray-600">
                Remove and return highest priority element. {type === 'heap' ? 'O(log n) complexity.' : 'O(1) complexity.'}
              </div>
            </div>
            <div>
              <div className="font-semibold text-blue-700 mb-1">Priority System</div>
              <div className="text-gray-600">Higher numbers indicate higher priority (0-10 scale)</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">
                {type === 'heap' ? 'Heap Property' : 'Array Ordering'}
              </div>
              <div className="text-gray-600">
                {type === 'heap' 
                  ? 'Parent nodes have higher priority than children'
                  : 'Elements stored in descending priority order'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
