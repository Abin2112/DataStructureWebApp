import React, { useState, useEffect } from 'react';
import { Plus, Minus, ArrowRight, ArrowLeft, Trash2, AlertCircle } from 'lucide-react';

interface ListNode {
  data: any;
  hasNext?: boolean;
  hasPrev?: boolean;
}

interface LinkedListVisualizerProps {
  type: 'singly' | 'doubly';
}

export function LinkedListVisualizer({ type }: LinkedListVisualizerProps) {
  const [listState, setListState] = useState<{ list: ListNode[]; size: number }>({
    list: [],
    size: 0
  });
  const [inputValue, setInputValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeList();
  }, [type]);

  const initializeList = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/linked-list/${type}/create/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setMessage(data.message);
      await fetchListState();
    } catch (error) {
      setMessage('Failed to initialize linked list');
    }
  };

  const fetchListState = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/linked-list/${type}/demo`);
      const data = await response.json();
      setListState(data);
    } catch (error) {
      setMessage('Failed to fetch list state');
    }
  };

  const handleAppend = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/linked-list/${type}/demo/append`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: inputValue.trim() })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setInputValue('');
        await fetchListState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to append element');
    }
    setIsLoading(false);
  };

  const handlePrepend = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/linked-list/${type}/demo/prepend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: inputValue.trim() })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setInputValue('');
        await fetchListState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to prepend element');
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteValue.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/linked-list/${type}/demo/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: deleteValue.trim() })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setDeleteValue('');
        await fetchListState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to delete element');
    }
    setIsLoading(false);
  };

  const renderNode = (node: ListNode, index: number) => {
    const isFirst = index === 0;
    const isLast = index === listState.list.length - 1;

    return (
      <div key={`${node.data}-${index}`} className="flex items-center">
        {/* Previous arrow for doubly linked list */}
        {type === 'doubly' && !isFirst && (
          <div className="flex items-center mr-2">
            <ArrowLeft className="h-4 w-4 text-gray-400" />
          </div>
        )}

        {/* Node */}
        <div className="bg-white border-2 border-blue-300 rounded-lg p-3 min-w-[60px] text-center font-mono font-semibold text-blue-800">
          {node.data}
        </div>

        {/* Next arrow */}
        {!isLast && (
          <div className="flex items-center mx-2">
            <ArrowRight className="h-4 w-4 text-gray-600" />
          </div>
        )}

        {/* Null indicator for last node */}
        {isLast && (
          <div className="flex items-center mx-2">
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="bg-gray-200 border border-gray-300 rounded px-2 py-1 text-xs text-gray-600">
              NULL
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {type === 'singly' ? 'Singly' : 'Doubly'} Linked List Visualizer
        </h2>
        
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Element
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAppend()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter value..."
                  disabled={isLoading}
                />
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handlePrepend}
                  disabled={!inputValue.trim() || isLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Prepend (Head)
                </button>
                <button
                  onClick={handleAppend}
                  disabled={!inputValue.trim() || isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Append (Tail)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delete Element
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={deleteValue}
                  onChange={(e) => setDeleteValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleDelete()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Value to delete..."
                  disabled={isLoading}
                />
                <button
                  onClick={handleDelete}
                  disabled={!deleteValue.trim() || isLoading || listState.list.length === 0}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">List Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-semibold capitalize">{type} Linked List</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="font-mono font-semibold">{listState.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Head:</span>
                <span className="font-mono font-semibold">
                  {listState.list.length > 0 ? listState.list[0].data : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tail:</span>
                <span className="font-mono font-semibold">
                  {listState.list.length > 0 
                    ? listState.list[listState.list.length - 1].data 
                    : 'None'
                  }
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

        {/* List Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {type === 'singly' ? 'Singly' : 'Doubly'} Linked List Structure
          </h3>
          
          <div className="overflow-x-auto">
            {listState.list.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                List is empty. Add some elements to see the visualization.
              </div>
            ) : (
              <div className="flex items-center justify-start min-w-max space-x-0">
                {/* Head indicator */}
                <div className="flex flex-col items-center mr-4">
                  <div className="text-xs text-green-600 font-semibold mb-1">HEAD</div>
                  <div className="w-px h-8 bg-green-400"></div>
                </div>

                {/* List nodes */}
                {listState.list.map((node, index) => renderNode(node, index))}

                {/* Tail indicator */}
                <div className="flex flex-col items-center ml-4">
                  <div className="text-xs text-red-600 font-semibold mb-1">TAIL</div>
                  <div className="w-px h-8 bg-red-400"></div>
                </div>
              </div>
            )}
          </div>

          {type === 'doubly' && listState.list.length > 0 && (
            <div className="mt-4 text-center text-xs text-gray-600">
              ← Bidirectional pointers (prev/next) →
            </div>
          )}
        </div>

        {/* Operations Guide */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {type === 'singly' ? 'Singly' : 'Doubly'} Linked List Operations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-green-700 mb-1">Prepend</div>
              <div className="text-gray-600">Add element at the beginning (new head)</div>
            </div>
            <div>
              <div className="font-semibold text-blue-700 mb-1">Append</div>
              <div className="text-gray-600">Add element at the end (new tail)</div>
            </div>
            <div>
              <div className="font-semibold text-red-700 mb-1">Delete</div>
              <div className="text-gray-600">Remove first occurrence of the value</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">
                {type === 'singly' ? 'Next Pointers' : 'Bidirectional Pointers'}  
              </div>
              <div className="text-gray-600">
                {type === 'singly' 
                  ? 'Each node points to the next node'
                  : 'Each node has both next and previous pointers'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}