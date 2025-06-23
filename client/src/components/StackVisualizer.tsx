import React, { useState, useEffect } from 'react';
import { Plus, Minus, Eye, Trash2, AlertCircle } from 'lucide-react';

interface StackState {
  stack: any[];
  size: number;
  isEmpty: boolean;
  top: any;
}

export function StackVisualizer() {
  const [stackState, setStackState] = useState<StackState>({
    stack: [],
    size: 0,
    isEmpty: true,
    top: null
  });
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastOperation, setLastOperation] = useState<string | null>(null);

  useEffect(() => {
    initializeStack();
  }, []);

  const initializeStack = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stack/create/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setMessage(data.message);
      await fetchStackState();
    } catch (error) {
      setMessage('Failed to initialize stack');
    }
  };

  const fetchStackState = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stack/demo');
      const data = await response.json();
      setStackState(data);
    } catch (error) {
      setMessage('Failed to fetch stack state');
    }
  };

  const handlePush = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    setLastOperation('push');
    try {
      const response = await fetch('http://localhost:3001/api/stack/demo/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: inputValue.trim() })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setInputValue('');
        await fetchStackState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to push element');
    }
    setIsLoading(false);
    setTimeout(() => setLastOperation(null), 1000);
  };

  const handlePop = async () => {
    setIsLoading(true);
    setLastOperation('pop');
    try {
      const response = await fetch('http://localhost:3001/api/stack/demo/pop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        await fetchStackState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to pop element');
    }
    setIsLoading(false);
    setTimeout(() => setLastOperation(null), 1000);
  };

  const handlePeek = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/stack/demo/peek');
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to peek');
    }
    setIsLoading(false);
  };

  const handleClear = async () => {
    setIsLoading(true);
    setLastOperation('clear');
    try {
      const response = await fetch('http://localhost:3001/api/stack/demo/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        await fetchStackState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to clear stack');
    }
    setIsLoading(false);
    setTimeout(() => setLastOperation(null), 1000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Stack Visualizer</h2>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Element to Push
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePush()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter value..."
                  disabled={isLoading}
                />
                <button
                  onClick={handlePush}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Push</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handlePop}
                disabled={stackState.isEmpty || isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
              >
                <Minus className="h-4 w-4" />
                <span>Pop</span>
              </button>
              <button
                onClick={handlePeek}
                disabled={stackState.isEmpty || isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Peek</span>
              </button>
              <button
                onClick={handleClear}
                disabled={stackState.isEmpty || isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Stack Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="font-mono font-semibold">{stackState.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Top Element:</span>
                <span className="font-mono font-semibold">
                  {stackState.top !== null ? stackState.top : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${stackState.isEmpty ? 'text-gray-500' : 'text-green-600'}`}>
                  {stackState.isEmpty ? 'Empty' : 'Has Elements'}
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

        {/* Stack Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Stack Structure (LIFO - Last In, First Out)</h3>
          
          <div className="flex flex-col items-center space-y-2">
            {stackState.stack.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                Stack is empty. Push some elements to see the visualization.
              </div>
            ) : (
              <>
                <div className="text-xs text-gray-600 mb-2">← Top of Stack</div>
                {[...stackState.stack].reverse().map((item, index) => {
                  const actualIndex = stackState.stack.length - 1 - index;
                  const isTop = actualIndex === stackState.stack.length - 1;
                  const isAnimated = lastOperation === 'push' && isTop;
                  
                  return (
                    <div
                      key={`${item}-${actualIndex}`}
                      className={`
                        w-32 h-12 flex items-center justify-center rounded-lg border-2 font-mono font-semibold
                        transition-all duration-500 transform
                        ${isTop 
                          ? 'bg-purple-100 border-purple-300 text-purple-800' 
                          : 'bg-white border-gray-300 text-gray-700'
                        }
                        ${isAnimated ? 'scale-110' : 'scale-100'}
                      `}
                    >
                      {item}
                    </div>
                  );
                })}
                <div className="text-xs text-gray-600 mt-2">← Bottom of Stack</div>
              </>
            )}
          </div>

          {stackState.stack.length > 0 && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-200 rounded"></div>
                  <span>Top Element</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <span>Other Elements</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Operations Guide */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Stack Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-purple-700 mb-1">Push</div>
              <div className="text-gray-600">Add an element to the top of the stack</div>
            </div>
            <div>
              <div className="font-semibold text-red-700 mb-1">Pop</div>
              <div className="text-gray-600">Remove and return the top element</div>
            </div>
            <div>
              <div className="font-semibold text-blue-700 mb-1">Peek</div>
              <div className="text-gray-600">View the top element without removing it</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Clear</div>
              <div className="text-gray-600">Remove all elements from the stack</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}