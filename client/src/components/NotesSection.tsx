import React, { useState } from 'react';
import { FileText, Clock, Zap, Database, Code, Lightbulb, BookOpen, Target } from 'lucide-react';

interface NotesSectionProps {
  dataStructure: {
    id: string;
    name: string;
    difficulty: string;
    timeComplexity: string;
    spaceComplexity: string;
    realWorldUse: string;
  };
}

const notesData: Record<string, any> = {
  stack: {
    overview: "A stack is a linear data structure that follows the Last In First Out (LIFO) principle. Think of it like a stack of plates - you can only add or remove plates from the top.",
    keyProperties: [
      "LIFO (Last In First Out) ordering",
      "Access only to the top element",
      "Dynamic size (in most implementations)",
      "No random access to elements"
    ],
    operations: [
      { name: "Push", description: "Add an element to the top", complexity: "O(1)" },
      { name: "Pop", description: "Remove and return the top element", complexity: "O(1)" },
      { name: "Peek/Top", description: "View the top element without removing", complexity: "O(1)" },
      { name: "isEmpty", description: "Check if stack is empty", complexity: "O(1)" },
      { name: "Size", description: "Get number of elements", complexity: "O(1)" }
    ],
    advantages: [
      "Simple implementation",
      "Efficient memory usage",
      "Fast operations (O(1))",
      "Automatic memory management"
    ],
    disadvantages: [
      "Limited access (only top element)",
      "No random access",
      "Stack overflow possibility",
      "Not suitable for searching"
    ],
    applications: [
      "Function call management (call stack)",
      "Undo operations in applications",
      "Expression evaluation and syntax parsing",
      "Backtracking algorithms",
      "Browser history",
      "Memory management"
    ],
    implementation: `class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        raise IndexError("Stack is empty")
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        raise IndexError("Stack is empty")
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)`
  },
  queue: {
    overview: "A queue is a linear data structure that follows the First In First Out (FIFO) principle. Like a line of people waiting - the first person in line is the first to be served.",
    keyProperties: [
      "FIFO (First In First Out) ordering",
      "Two ends: front (for removal) and rear (for insertion)",
      "Dynamic size",
      "Sequential access"
    ],
    operations: [
      { name: "Enqueue", description: "Add an element to the rear", complexity: "O(1)" },
      { name: "Dequeue", description: "Remove and return the front element", complexity: "O(1)" },
      { name: "Front", description: "View the front element", complexity: "O(1)" },
      { name: "Rear", description: "View the rear element", complexity: "O(1)" },
      { name: "isEmpty", description: "Check if queue is empty", complexity: "O(1)" }
    ],
    advantages: [
      "Fair ordering (FIFO)",
      "Efficient for sequential processing",
      "Simple implementation",
      "Good for buffering"
    ],
    disadvantages: [
      "No random access",
      "Memory waste in array implementation",
      "Limited access points",
      "Queue overflow/underflow"
    ],
    applications: [
      "CPU scheduling",
      "Breadth-First Search (BFS)",
      "Print queue management",
      "Handling requests in web servers",
      "Buffer for data streams",
      "Level-order tree traversal"
    ],
    implementation: `class Queue:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        self.items.append(item)
    
    def dequeue(self):
        if not self.is_empty():
            return self.items.pop(0)
        raise IndexError("Queue is empty")
    
    def front(self):
        if not self.is_empty():
            return self.items[0]
        raise IndexError("Queue is empty")
    
    def rear(self):
        if not self.is_empty():
            return self.items[-1]
        raise IndexError("Queue is empty")
    
    def is_empty(self):
        return len(self.items) == 0`
  },
  'binary-tree': {
    overview: "A Binary Search Tree (BST) is a hierarchical data structure where each node has at most two children, and the left subtree contains values less than the parent, while the right subtree contains values greater than the parent.",
    keyProperties: [
      "Each node has at most two children",
      "Left subtree values < parent < right subtree values",
      "No duplicate values (typically)",
      "Recursive structure"
    ],
    operations: [
      { name: "Insert", description: "Add a new node maintaining BST property", complexity: "O(log n) avg, O(n) worst" },
      { name: "Search", description: "Find a specific value", complexity: "O(log n) avg, O(n) worst" },
      { name: "Delete", description: "Remove a node", complexity: "O(log n) avg, O(n) worst" },
      { name: "Traversal", description: "Visit all nodes in specific order", complexity: "O(n)" }
    ],
    advantages: [
      "Efficient searching in balanced trees",
      "Inorder traversal gives sorted sequence",
      "Dynamic size",
      "No memory waste"
    ],
    disadvantages: [
      "Can become unbalanced (worst case O(n))",
      "No constant time operations",
      "Complex deletion with two children",
      "Requires balancing for optimal performance"
    ],
    applications: [
      "Database indexing",
      "File systems",
      "Expression parsing",
      "Autocomplete features",
      "Priority queues",
      "Compiler symbol tables"
    ],
    implementation: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BST:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        self.root = self._insert_recursive(self.root, val)
    
    def _insert_recursive(self, node, val):
        if not node:
            return TreeNode(val)
        
        if val < node.val:
            node.left = self._insert_recursive(node.left, val)
        elif val > node.val:
            node.right = self._insert_recursive(node.right, val)
        
        return node
    
    def search(self, val):
        return self._search_recursive(self.root, val)
    
    def _search_recursive(self, node, val):
        if not node or node.val == val:
            return node
        
        if val < node.val:
            return self._search_recursive(node.left, val)
        return self._search_recursive(node.right, val)`
  },
  'hash-table': {
    overview: "A hash table is a data structure that implements an associative array, mapping keys to values using a hash function to compute an index into an array of buckets or slots.",
    keyProperties: [
      "Key-value pair storage",
      "Hash function maps keys to indices",
      "Collision handling mechanisms",
      "Dynamic resizing capability"
    ],
    operations: [
      { name: "Insert/Set", description: "Add or update a key-value pair", complexity: "O(1) avg, O(n) worst" },
      { name: "Get", description: "Retrieve value by key", complexity: "O(1) avg, O(n) worst" },
      { name: "Delete", description: "Remove a key-value pair", complexity: "O(1) avg, O(n) worst" },
      { name: "Contains", description: "Check if key exists", complexity: "O(1) avg, O(n) worst" }
    ],
    advantages: [
      "Very fast average-case operations",
      "Flexible key types",
      "Dynamic sizing",
      "Memory efficient for sparse data"
    ],
    disadvantages: [
      "Worst-case O(n) performance",
      "No ordering of elements",
      "Hash function dependency",
      "Collision handling complexity"
    ],
    applications: [
      "Database indexing",
      "Caching systems",
      "Symbol tables in compilers",
      "Associative arrays",
      "Set implementations",
      "Memoization in dynamic programming"
    ],
    implementation: `class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]
    
    def _hash(self, key):
        return hash(key) % self.size
    
    def set(self, key, value):
        index = self._hash(key)
        bucket = self.table[index]
        
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        
        bucket.append((key, value))
    
    def get(self, key):
        index = self._hash(key)
        bucket = self.table[index]
        
        for k, v in bucket:
            if k == key:
                return v
        
        raise KeyError(key)
    
    def delete(self, key):
        index = self._hash(key)
        bucket = self.table[index]
        
        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                return
        
        raise KeyError(key)`
  }
};

export function NotesSection({ dataStructure }: NotesSectionProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const notes = notesData[dataStructure.id];

  if (!notes) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Notes Coming Soon</h3>
        <p className="text-gray-600">
          We're preparing comprehensive study notes for {dataStructure.name}. Check back soon!
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'operations', label: 'Operations', icon: Zap },
    { id: 'applications', label: 'Applications', icon: Target },
    { id: 'implementation', label: 'Code', icon: Code }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{dataStructure.name} Study Notes</h2>
            <p className="text-gray-600">Comprehensive guide and reference material</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Time Complexity</span>
            </div>
            <div className="font-mono font-bold text-blue-900">{dataStructure.timeComplexity}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Database className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Space Complexity</span>
            </div>
            <div className="font-mono font-bold text-purple-900">{dataStructure.spaceComplexity}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Difficulty</span>
            </div>
            <div className="font-semibold text-green-900">{dataStructure.difficulty}</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Lightbulb className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">Category</span>
            </div>
            <div className="font-semibold text-orange-900">Linear</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex space-x-0">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors
                  ${activeTab === id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What is a {dataStructure.name}?</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{notes.overview}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Properties</h3>
                <ul className="space-y-2">
                  {notes.keyProperties.map((property: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{property}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-green-700">Advantages</h3>
                  <ul className="space-y-2">
                    {notes.advantages.map((advantage: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-red-700">Disadvantages</h3>
                  <ul className="space-y-2">
                    {notes.disadvantages.map((disadvantage: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{disadvantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'operations' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Core Operations</h3>
              <div className="space-y-4">
                {notes.operations.map((operation: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{operation.name}</h4>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-mono">
                        {operation.complexity}
                      </span>
                    </div>
                    <p className="text-gray-700">{operation.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Real-World Applications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.applications.map((application: string, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-800 font-medium">{application}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'implementation' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Python Implementation</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Python 3.x
                </span>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-green-400 text-sm leading-relaxed">
                  <code>{notes.implementation}</code>
                </pre>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-900 mb-1">Implementation Notes</div>
                    <div className="text-blue-800 text-sm">
                      This is a basic implementation for educational purposes. Production implementations 
                      may include additional optimizations, error handling, and features.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}