import React, { useState, useEffect } from 'react';
import { Plus, Minus, Search, Trash2, AlertCircle, Eye } from 'lucide-react';

interface TreeNode {
  data: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface SearchResult {
  found: boolean;
  path: number[];
}

export function BinaryTreeVisualizer() {
  const [treeState, setTreeState] = useState<{ tree: TreeNode | null }>({ tree: null });
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [traversalResult, setTraversalResult] = useState<{ type: string; result: number[] } | null>(null);

  useEffect(() => {
    initializeTree();
  }, []);

  const initializeTree = async () => {
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/binary-tree/create/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setMessage(data.message);
      await fetchTreeState();
    } catch (error) {
      setMessage('Failed to initialize binary tree');
    }
  };

  const fetchTreeState = async () => {
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/binary-tree/demo');
      const data = await response.json();
      setTreeState(data);
    } catch (error) {
      setMessage('Failed to fetch tree state');
    }
  };

  const handleInsert = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/binary-tree/demo/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setInputValue('');
        await fetchTreeState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to insert node');
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const value = parseInt(deleteValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/binary-tree/demo/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setDeleteValue('');
        await fetchTreeState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to delete node');
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/binary-tree/demo/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setSearchResult(data.searchResult);
        setSearchValue('');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to search');
    }
    setIsLoading(false);
  };

  const handleTraversal = async (type: 'inorder' | 'preorder' | 'postorder') => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://datastructurewebapp.onrender.com/api/binary-tree/demo/traversal/${type}`);
      const data = await response.json();
      setTraversalResult({ type, result: data.traversal });
      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} traversal completed`);
    } catch (error) {
      setMessage('Failed to perform traversal');
    }
    setIsLoading(false);
  };

  const handleClear = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/binary-tree/demo/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setSearchResult(null);
        setTraversalResult(null);
        await fetchTreeState();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to clear tree');
    }
    setIsLoading(false);
  };

  const renderTree = (node: TreeNode | null, level: number = 0): JSX.Element | null => {
    if (!node) return null;

    const isInSearchPath = searchResult?.path.includes(node.data) || false;
    const isSearchTarget = searchResult?.found && searchResult.path[searchResult.path.length - 1] === node.data;

    return (
      <div className="flex flex-col items-center">
        <div
          className={`
            w-12 h-12 flex items-center justify-center rounded-full border-2 font-mono font-semibold text-sm
            transition-all duration-500
            ${isSearchTarget 
              ? 'bg-green-100 border-green-400 text-green-800 ring-2 ring-green-300' 
              : isInSearchPath
              ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
              : 'bg-blue-100 border-blue-300 text-blue-800'
            }
          `}
        >
          {node.data}
        </div>
        
        {(node.left || node.right) && (
          <div className="flex mt-4 space-x-8">
            <div className="flex flex-col items-center">
              {node.left && (
                <>
                  <div className="w-px h-4 bg-gray-400"></div>
                  <div className="w-8 h-px bg-gray-400"></div>
                  <div className="w-px h-4 bg-gray-400"></div>
                  {renderTree(node.left, level + 1)}
                </>
              )}
            </div>
            
            <div className="flex flex-col items-center">
              {node.right && (
                <>
                  <div className="w-px h-4 bg-gray-400"></div>
                  <div className="w-8 h-px bg-gray-400"></div>
                  <div className="w-px h-4 bg-gray-400"></div>
                  {renderTree(node.right, level + 1)}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Binary Search Tree Visualizer</h2>
        
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insert Node
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter number..."
                  disabled={isLoading}
                />
                <button
                  onClick={handleInsert}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Insert</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Node
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Search number..."
                  disabled={isLoading}
                />
                <button
                  onClick={handleSearch}
                  disabled={!searchValue.trim() || isLoading || !treeState.tree}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delete Node
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={deleteValue}
                  onChange={(e) => setDeleteValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleDelete()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Delete number..."
                  disabled={isLoading}
                />
                <button
                  onClick={handleDelete}
                  disabled={!deleteValue.trim() || isLoading || !treeState.tree}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tree Traversals
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => handleTraversal('inorder')}
                  disabled={isLoading || !treeState.tree}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Inorder (Left-Root-Right)
                </button>
                <button
                  onClick={() => handleTraversal('preorder')}
                  disabled={isLoading || !treeState.tree}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Preorder (Root-Left-Right)
                </button>
                <button
                  onClick={() => handleTraversal('postorder')}
                  disabled={isLoading || !treeState.tree}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Postorder (Left-Right-Root)
                </button>
              </div>
            </div>

            <button
              onClick={handleClear}
              disabled={isLoading || !treeState.tree}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Tree</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Tree Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${!treeState.tree ? 'text-gray-500' : 'text-blue-600'}`}>
                  {!treeState.tree ? 'Empty' : 'Has Nodes'}
                </span>
              </div>
              {searchResult && (
                <div className="mt-3 p-2 bg-white rounded border">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Search Result:</div>
                  <div className={`text-sm ${searchResult.found ? 'text-green-600' : 'text-red-600'}`}>
                    {searchResult.found ? 'Found!' : 'Not found'}
                  </div>
                  {searchResult.path.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      Path: {searchResult.path.join(' → ')}
                    </div>
                  )}
                </div>
              )}
              {traversalResult && (
                <div className="mt-3 p-2 bg-white rounded border">
                  <div className="text-xs font-semibold text-gray-700 mb-1">
                    {traversalResult.type.charAt(0).toUpperCase() + traversalResult.type.slice(1)} Traversal:
                  </div>
                  <div className="text-sm font-mono text-blue-600">
                    [{traversalResult.result.join(', ')}]
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

        {/* Tree Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Binary Search Tree Structure</h3>
          
          <div className="flex justify-center overflow-x-auto min-h-[200px]">
            {!treeState.tree ? (
              <div className="text-gray-500 text-center py-8">
                Tree is empty. Insert some numbers to see the visualization.
              </div>
            ) : (
              <div className="py-4">
                {renderTree(treeState.tree)}
              </div>
            )}
          </div>

          {treeState.tree && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                  <span>Normal Node</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
                  <span>Search Path</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-200 rounded-full"></div>
                  <span>Search Target</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Operations Guide */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Binary Search Tree Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-blue-700 mb-1">BST Property</div>
              <div className="text-gray-600">Left subtree values {'<'} root {'<'} right subtree values</div>
            </div>
            <div>
              <div className="font-semibold text-green-700 mb-1">Search Efficiency</div>
              <div className="text-gray-600">Average O(log n) time complexity for balanced trees</div>
            </div>
            <div>
              <div className="font-semibold text-purple-700 mb-1">Inorder Traversal</div>
              <div className="text-gray-600">Visits nodes in sorted order (ascending)</div>
            </div>
            <div>
              <div className="font-semibold text-red-700 mb-1">Deletion Cases</div>
              <div className="text-gray-600">Handles leaf, single child, and two children scenarios</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
