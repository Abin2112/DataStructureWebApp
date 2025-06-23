import React, { useState, useEffect } from 'react';
import { Plus, Search, Minus, Trash2, AlertCircle, Hash } from 'lucide-react';

interface HashBucket {
  index: number;
  bucket: [string, any][] | null;
  hasCollision: boolean;
  key?: string | null;
  value?: any;
  isEmpty?: boolean;
  originalIndex?: number | null;
}

interface HashTableState {
  table: HashBucket[];
  size: number;
  count: number;
  loadFactor: string;
}

interface HashTableVisualizerProps {
  type: 'chaining' | 'linear-probing';
}

export function HashTableVisualizer({ type }: HashTableVisualizerProps) {
  const [hashTableState, setHashTableState] = useState<HashTableState>({
    table: [],
    size: 0,
    count: 0,
    loadFactor: '0.00'
  });
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [deleteKey, setDeleteKey] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{ key: string; value: any; found: boolean } | null>(null);

  useEffect(() => {
    initializeHashTable();
  }, [type]);

  const initializeHashTable = async () => {
    try {
      const endpoint = type === 'linear-probing' ? 'linear-probing/create' : 'create';
      const response = await fetch(`https://datastructurewebapp.onrender.com/api/hash-table/${endpoint}/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: 8 })
      });
      const data = await response.json();
      setMessage(data.message);
      await fetchHashTableState();
    } catch (error) {
      setMessage('Failed to initialize hash table');
    }
  };

  const fetchHashTableState = async () => {
    try {
      const endpoint = type === 'linear-probing' ? 'linear-probing/demo' : 'demo';
      const response = await fetch(`https://datastructurewebapp.onrender.com/api/hash-table/${endpoint}`);
      const data = await response.json();
      setHashTableState(data.hashTable);
    } catch (error) {
      setMessage('Failed to fetch hash table state');
    }
  };

  const handleSet = async () => {
    if (!keyInput.trim() || !valueInput.trim()) return;
    
    setIsLoading(true);
    try {
      const endpoint = type === 'linear-probing' ? 'linear-probing/demo/set' : 'demo/set';
      const response = await fetch(`https://datastructurewebapp.onrender.com/api/hash-table/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: keyInput.trim(), value: valueInput.trim() })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setKeyInput('');
        setValueInput('');
        await fetchHashTableState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to set key-value pair');
    }
    setIsLoading(false);
  };

  const handleGet = async () => {
    if (!searchKey.trim()) return;
    
    setIsLoading(true);
    try {
      const endpoint = type === 'linear-probing' ? 'linear-probing/demo/get' : 'demo/get';
      const response = await fetch(`https://datastructurewebapp.onrender.com/api/hash-table/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: searchKey.trim() })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setSearchResult({ key: data.key, value: data.value, found: data.found });
        setSearchKey('');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to get value');
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteKey.trim()) return;
    
    setIsLoading(true);
    try {
      const endpoint = type === 'linear-probing' ? 'linear-probing/demo/delete' : 'demo/delete';
      const response = await fetch(`https://datastructurewebapp.onrender.com/api/hash-table/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: deleteKey.trim() })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setDeleteKey('');
        await fetchHashTableState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to delete key');
    }
    setIsLoading(false);
  };

  const renderChainingBucket = (bucket: HashBucket) => {
    if (!bucket.bucket || bucket.bucket.length === 0) {
      return (
        <div className="bg-gray-100 border border-gray-300 rounded p-2 text-center text-gray-500 text-sm">
          Empty
        </div>
      );
    }

    return (
      <div className={`border rounded p-2 ${bucket.hasCollision ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'}`}>
        {bucket.bucket.map(([key, value], idx) => (
          <div key={idx} className="text-sm font-mono">
            <span className="font-semibold text-blue-700">{key}</span>
            <span className="text-gray-600">: </span>
            <span className="text-green-700">{value}</span>
            {idx < bucket.bucket!.length - 1 && <div className="border-t border-gray-300 my-1"></div>}
          </div>
        ))}
        {bucket.hasCollision && (
          <div className="text-xs text-red-600 mt-1 font-semibold">Collision!</div>
        )}
      </div>
    );
  };

  const renderLinearProbingBucket = (bucket: HashBucket) => {
    if (bucket.isEmpty) {
      return (
        <div className="bg-gray-100 border border-gray-300 rounded p-2 text-center text-gray-500 text-sm">
          Empty
        </div>
      );
    }

    const isProbed = bucket.originalIndex !== null && bucket.originalIndex !== bucket.index;

    return (
      <div className={`border rounded p-2 ${isProbed ? 'bg-yellow-50 border-yellow-300' : 'bg-blue-50 border-blue-300'}`}>
        <div className="text-sm font-mono">
          <span className="font-semibold text-blue-700">{bucket.key}</span>
          <span className="text-gray-600">: </span>
          <span className="text-green-700">{bucket.value}</span>
        </div>
        {isProbed && (
          <div className="text-xs text-yellow-700 mt-1">
            Original: {bucket.originalIndex}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Hash Table Visualizer ({type === 'chaining' ? 'Chaining' : 'Linear Probing'})
        </h2>
        
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Key-Value Pair
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter key..."
                  disabled={isLoading}
                />
                <input
                  type="text"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter value..."
                  disabled={isLoading}
                />
                <button
                  onClick={handleSet}
                  disabled={!keyInput.trim() || !valueInput.trim() || isLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Set</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search and Delete
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGet()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search key..."
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleGet}
                    disabled={!searchKey.trim() || isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    <span>Get</span>
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={deleteKey}
                    onChange={(e) => setDeleteKey(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleDelete()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Delete key..."
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleDelete}
                    disabled={!deleteKey.trim() || isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Hash Table Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Collision Method:</span>
                <span className="font-semibold">{type === 'chaining' ? 'Chaining' : 'Linear Probing'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Table Size:</span>
                <span className="font-mono font-semibold">{hashTableState.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Elements:</span>
                <span className="font-mono font-semibold">{hashTableState.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Load Factor:</span>
                <span className={`font-mono font-semibold ${parseFloat(hashTableState.loadFactor) > 0.7 ? 'text-red-600' : 'text-green-600'}`}>
                  {hashTableState.loadFactor}
                </span>
              </div>
              {searchResult && (
                <div className="mt-3 p-2 bg-white rounded border">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Search Result:</div>
                  <div className={`text-sm ${searchResult.found ? 'text-green-600' : 'text-red-600'}`}>
                    {searchResult.found 
                      ? `${searchResult.key}: ${searchResult.value}` 
                      : `Key "${searchResult.key}" not found`
                    }
                  </div>
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

        {/* Hash Table Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Hash Table Structure ({type === 'chaining' ? 'Separate Chaining' : 'Open Addressing'})
          </h3>
          
          <div className="space-y-3">
            {hashTableState.table.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                Hash table is empty. Add some key-value pairs to see the visualization.
              </div>
            ) : (
              hashTableState.table.map((bucket, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-gray-200 border border-gray-400 rounded flex items-center justify-center text-sm font-mono font-semibold">
                    {index}
                  </div>
                  <div className="flex-1">
                    {type === 'chaining' 
                      ? renderChainingBucket(bucket)
                      : renderLinearProbingBucket(bucket)
                    }
                  </div>
                </div>
              ))
            )}
          </div>

          {hashTableState.table.length > 0 && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <span>Empty Slot</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-200 rounded"></div>
                  <span>Occupied</span>
                </div>
                {type === 'chaining' ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-200 rounded"></div>
                    <span>Collision</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                    <span>Probed</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Operations Guide */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Hash Table - {type === 'chaining' ? 'Separate Chaining' : 'Linear Probing'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-blue-700 mb-1">Hash Function</div>
              <div className="text-gray-600">Simple character sum modulo table size</div>
            </div>
            <div>
              <div className="font-semibold text-green-700 mb-1">Collision Resolution</div>
              <div className="text-gray-600">
                {type === 'chaining' 
                  ? 'Store multiple values in linked lists at same index'
                  : 'Find next available slot using linear probing'
                }
              </div>
            </div>
            <div>
              <div className="font-semibold text-purple-700 mb-1">Load Factor</div>
              <div className="text-gray-600">
                Ratio of elements to table size. High values ({'>'} 0.7) indicate need for resizing
              </div>
            </div>
            <div>
              <div className="font-semibold text-orange-700 mb-1">Time Complexity</div>
              <div className="text-gray-600">
                Average O(1) for all operations, O(n) worst case
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
