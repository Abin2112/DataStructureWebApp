import React, { useState, useEffect } from 'react';
import { Plus, Minus, Eye, Trash2, AlertCircle, ArrowRight } from 'lucide-react';

interface QueueState {
  queue: any[];
  size: number;
  isEmpty: boolean;
  front: any;
  rear: any;
}

export function QueueVisualizer() {
  const [queueState, setQueueState] = useState<QueueState>({
    queue: [],
    size: 0,
    isEmpty: true,
    front: null,
    rear: null
  });
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastOperation, setLastOperation] = useState<string | null>(null);

  useEffect(() => {
    initializeQueue();
  }, []);

  const initializeQueue = async () => {
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/queue/create/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setMessage(data.message);
      await fetchQueueState();
    } catch (error) {
      setMessage('Failed to initialize queue');
    }
  };

  const fetchQueueState = async () => {
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/queue/demo');
      const data = await response.json();
      setQueueState(data);
    } catch (error) {
      setMessage('Failed to fetch queue state');
    }
  };

  const handleEnqueue = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    setLastOperation('enqueue');
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/queue/demo/enqueue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: inputValue.trim() })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setInputValue('');
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
      const response = await fetch('https://datastructurewebapp.onrender.com/api/queue/demo/dequeue', {
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

  const handleClear = async () => {
    setIsLoading(true);
    setLastOperation('clear');
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/queue/demo/clear', {
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
      setMessage('Failed to clear queue');
    }
    setIsLoading(false);
    setTimeout(() => setLastOperation(null), 1000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Queue Visualizer</h2>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Element to Enqueue
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEnqueue()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter value..."
                  disabled={isLoading}
                />
                <button
                  onClick={handleEnqueue}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Enqueue</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleDequeue}
                disabled={queueState.isEmpty || isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
              >
                <Minus className="h-4 w-4" />
                <span>Dequeue</span>
              </button>
              <button
                onClick={handleClear}
                disabled={queueState.isEmpty || isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Queue Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="font-mono font-semibold">{queueState.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Front Element:</span>
                <span className="font-mono font-semibold">
                  {queueState.front !== null ? queueState.front : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rear Element:</span>
                <span className="font-mono font-semibold">
                  {queueState.rear !== null ? queueState.rear : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${queueState.isEmpty ? 'text-gray-500' : 'text-green-600'}`}>
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

        {/* Queue Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Queue Structure (FIFO - First In, First Out)</h3>
          
          <div className="flex flex-col items-center space-y-4">
            {queueState.queue.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                Queue is empty. Enqueue some elements to see the visualization.
              </div>
            ) : (
              <>
                {/* Direction indicators */}
                <div className="flex items-center justify-between w-full max-w-4xl text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span>Dequeue</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <ArrowRight className="h-3 w-3" />
                    <span>Enqueue</span>
                  </div>
                </div>

                {/* Queue elements */}
                <div className="flex items-center space-x-2 overflow-x-auto max-w-4xl">
                  {/* Front indicator */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-green-600 font-semibold mb-1">FRONT</div>
                    <div className="w-px h-12 bg-green-400"></div>
                  </div>

                  {queueState.queue.map((item, index) => {
                    const isFront = index === 0;
                    const isRear = index === queueState.queue.length - 1;
                    const isAnimated = (lastOperation === 'enqueue' && isRear) || 
                                     (lastOperation === 'dequeue' && isFront);
                    
                    return (
                      <div key={`${item}-${index}`} className="flex items-center">
                        <div
                          className={`
                            w-16 h-12 flex items-center justify-center rounded-lg border-2 font-mono font-semibold
                            transition-all duration-500 transform
                            ${isFront 
                              ? 'bg-green-100 border-green-300 text-green-800' 
                              : isRear
                              ? 'bg-blue-100 border-blue-300 text-blue-800'
                              : 'bg-white border-gray-300 text-gray-700'
                            }
                            ${isAnimated ? 'scale-110' : 'scale-100'}
                          `}
                        >
                          {item}
                        </div>
                        {index < queueState.queue.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-gray-400 mx-1" />
                        )}
                      </div>
                    );
                  })}

                  {/* Rear indicator */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-blue-600 font-semibold mb-1">REAR</div>
                    <div className="w-px h-12 bg-blue-400"></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-200 rounded"></div>
                      <span>Front Element</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-200 rounded"></div>
                      <span>Rear Element</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-gray-200 rounded"></div>
                      <span>Other Elements</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Operations Guide */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Queue Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-green-700 mb-1">Enqueue</div>
              <div className="text-gray-600">Add an element to the rear of the queue</div>
            </div>
            <div>
              <div className="font-semibold text-red-700 mb-1">Dequeue</div>
              <div className="text-gray-600">Remove and return the front element</div>
            </div>
            <div>
              <div className="font-semibold text-blue-700 mb-1">FIFO Property</div>
              <div className="text-gray-600">First element added is first to be removed</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Clear</div>
              <div className="text-gray-600">Remove all elements from the queue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
