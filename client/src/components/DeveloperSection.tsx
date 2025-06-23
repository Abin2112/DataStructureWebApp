import React, { useState } from 'react';
import { Code, Users, Github, BookOpen, ExternalLink, Copy, Check } from 'lucide-react';

interface DeveloperSectionProps {
  dataStructure: {
    id: string;
    name: string;
  };
}

const developerData: Record<string, any> = {
  stack: {
    implementations: {
      python: `class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        """Add item to top of stack - O(1)"""
        self.items.append(item)
    
    def pop(self):
        """Remove and return top item - O(1)"""
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self.items.pop()
    
    def peek(self):
        """Return top item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("peek from empty stack")
        return self.items[-1]
    
    def is_empty(self):
        """Check if stack is empty - O(1)"""
        return len(self.items) == 0
    
    def size(self):
        """Return number of items - O(1)"""
        return len(self.items)

# Usage example
stack = Stack()
stack.push(1)
stack.push(2)
stack.push(3)
print(stack.pop())  # 3
print(stack.peek()) # 2`,
      
      javascript: `class Stack {
    constructor() {
        this.items = [];
    }
    
    // Add item to top of stack - O(1)
    push(item) {
        this.items.push(item);
    }
    
    // Remove and return top item - O(1)
    pop() {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        return this.items.pop();
    }
    
    // Return top item without removing - O(1)
    peek() {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        return this.items[this.items.length - 1];
    }
    
    // Check if stack is empty - O(1)
    isEmpty() {
        return this.items.length === 0;
    }
    
    // Return number of items - O(1)
    size() {
        return this.items.length;
    }
}

// Usage example
const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.pop());  // 3
console.log(stack.peek()); // 2`,

      java: `import java.util.ArrayList;
import java.util.EmptyStackException;

public class Stack<T> {
    private ArrayList<T> items;
    
    public Stack() {
        items = new ArrayList<>();
    }
    
    // Add item to top of stack - O(1)
    public void push(T item) {
        items.add(item);
    }
    
    // Remove and return top item - O(1)
    public T pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return items.remove(items.size() - 1);
    }
    
    // Return top item without removing - O(1)
    public T peek() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return items.get(items.size() - 1);
    }
    
    // Check if stack is empty - O(1)
    public boolean isEmpty() {
        return items.isEmpty();
    }
    
    // Return number of items - O(1)
    public int size() {
        return items.size();
    }
}

// Usage example
Stack<Integer> stack = new Stack<>();
stack.push(1);
stack.push(2);
stack.push(3);
System.out.println(stack.pop());  // 3
System.out.println(stack.peek()); // 2`
    },
    
    bestPractices: [
      "Always check for empty stack before pop/peek operations",
      "Consider using built-in stack implementations when available",
      "Handle stack overflow in fixed-size implementations",
      "Use meaningful variable names for stack operations",
      "Implement proper error handling and exceptions",
      "Consider thread safety for concurrent applications"
    ],
    
    commonMistakes: [
      "Not checking for empty stack before operations",
      "Confusing stack with queue operations",
      "Memory leaks in manual memory management languages",
      "Not handling stack overflow conditions",
      "Using wrong data structure for the problem"
    ],
    
    optimizations: [
      "Use arrays with dynamic resizing for better cache locality",
      "Implement stack using linked lists for unlimited size",
      "Consider using circular buffers for fixed-size stacks",
      "Batch operations when possible to reduce overhead",
      "Use stack pooling for frequent allocations/deallocations"
    ],
    
    resources: [
      { title: "Stack Data Structure - GeeksforGeeks", url: "https://www.geeksforgeeks.org/stack-data-structure/" },
      { title: "Stack Implementation - LeetCode", url: "https://leetcode.com/explore/learn/card/queue-stack/" },
      { title: "Stack Applications - Programiz", url: "https://www.programiz.com/dsa/stack" },
      { title: "Stack vs Queue - Difference", url: "https://www.programiz.com/dsa/stack-vs-queue" }
    ]
  },
  
  queue: {
    implementations: {
      python: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):
        """Add item to rear of queue - O(1)"""
        self.items.append(item)
    
    def dequeue(self):
        """Remove and return front item - O(1)"""
        if self.is_empty():
            raise IndexError("dequeue from empty queue")
        return self.items.popleft()
    
    def front(self):
        """Return front item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("front from empty queue")
        return self.items[0]
    
    def rear(self):
        """Return rear item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("rear from empty queue")
        return self.items[-1]
    
    def is_empty(self):
        """Check if queue is empty - O(1)"""
        return len(self.items) == 0
    
    def size(self):
        """Return number of items - O(1)"""
        return len(self.items)

# Usage example
queue = Queue()
queue.enqueue(1)
queue.enqueue(2)
queue.enqueue(3)
print(queue.dequeue())  # 1
print(queue.front())    # 2`,

      javascript: `class Queue {
    constructor() {
        this.items = [];
        this.frontIndex = 0;
    }
    
    // Add item to rear of queue - O(1)
    enqueue(item) {
        this.items.push(item);
    }
    
    // Remove and return front item - O(1) amortized
    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        
        const item = this.items[this.frontIndex];
        this.frontIndex++;
        
        // Reset array when it gets too sparse
        if (this.frontIndex > this.items.length / 2) {
            this.items = this.items.slice(this.frontIndex);
            this.frontIndex = 0;
        }
        
        return item;
    }
    
    // Return front item without removing - O(1)
    front() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        return this.items[this.frontIndex];
    }
    
    // Return rear item without removing - O(1)
    rear() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        return this.items[this.items.length - 1];
    }
    
    // Check if queue is empty - O(1)
    isEmpty() {
        return this.frontIndex >= this.items.length;
    }
    
    // Return number of items - O(1)
    size() {
        return this.items.length - this.frontIndex;
    }
}`,

      java: `import java.util.LinkedList;
import java.util.NoSuchElementException;

public class Queue<T> {
    private LinkedList<T> items;
    
    public Queue() {
        items = new LinkedList<>();
    }
    
    // Add item to rear of queue - O(1)
    public void enqueue(T item) {
        items.addLast(item);
    }
    
    // Remove and return front item - O(1)
    public T dequeue() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        return items.removeFirst();
    }
    
    // Return front item without removing - O(1)
    public T front() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        return items.getFirst();
    }
    
    // Return rear item without removing - O(1)
    public T rear() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        return items.getLast();
    }
    
    // Check if queue is empty - O(1)
    public boolean isEmpty() {
        return items.isEmpty();
    }
    
    // Return number of items - O(1)
    public int size() {
        return items.size();
    }
}`
    },
    
    bestPractices: [
      "Use deque for efficient front and rear operations",
      "Consider circular queue for fixed-size implementations",
      "Handle queue overflow and underflow conditions",
      "Choose appropriate underlying data structure",
      "Implement proper error handling",
      "Consider thread safety for concurrent access"
    ],
    
    commonMistakes: [
      "Using list.pop(0) in Python (O(n) operation)",
      "Not handling empty queue conditions",
      "Memory waste in naive array implementations",
      "Confusing queue with stack operations",
      "Not considering queue size limits"
    ],
    
    optimizations: [
      "Use circular buffer for fixed-size queues",
      "Implement using linked lists for dynamic size",
      "Consider double-ended queue (deque) for flexibility",
      "Use array resizing strategies for dynamic arrays",
      "Implement queue using two stacks for special cases"
    ],
    
    resources: [
      { title: "Queue Data Structure - GeeksforGeeks", url: "https://www.geeksforgeeks.org/queue-data-structure/" },
      { title: "Queue Implementation - LeetCode", url: "https://leetcode.com/explore/learn/card/queue-stack/" },
      { title: "Circular Queue - Programiz", url: "https://www.programiz.com/dsa/circular-queue" },
      { title: "Priority Queue - Wikipedia", url: "https://en.wikipedia.org/wiki/Priority_queue" }
    ]
  }
};

export function DeveloperSection({ dataStructure }: DeveloperSectionProps) {
  const [activeLanguage, setActiveLanguage] = useState('python');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const data = developerData[dataStructure.id];

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Developer Resources Coming Soon</h3>
        <p className="text-gray-600">
          We're preparing comprehensive implementation guides for {dataStructure.name}. Check back soon!
        </p>
      </div>
    );
  }

  const copyToClipboard = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(language);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const languages = [
    { id: 'python', name: 'Python', color: 'bg-blue-500' },
    { id: 'javascript', name: 'JavaScript', color: 'bg-yellow-500' },
    { id: 'java', name: 'Java', color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-xl">
            <Code className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{dataStructure.name} Implementation Guide</h2>
            <p className="text-gray-600">Production-ready code examples and best practices</p>
          </div>
        </div>
      </div>

      {/* Code Implementation */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Implementation Examples</h3>
          <div className="flex space-x-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setActiveLanguage(lang.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-colors
                  ${activeLanguage === lang.id
                    ? `${lang.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => copyToClipboard(data.implementations[activeLanguage], activeLanguage)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
            >
              {copiedCode === activeLanguage ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          
          <div className="bg-gray-900 p-6 overflow-x-auto">
            <pre className="text-green-400 text-sm leading-relaxed">
              <code>{data.implementations[activeLanguage]}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-green-700">Best Practices</h3>
          <ul className="space-y-3">
            {data.bestPractices.map((practice: string, index: number) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{practice}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-red-700">Common Mistakes</h3>
          <ul className="space-y-3">
            {data.commonMistakes.map((mistake: string, index: number) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Optimizations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-purple-700">Performance Optimizations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.optimizations.map((optimization: string, index: number) => (
            <div key={index} className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-800">{optimization}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.resources.map((resource: any, index: number) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900 group-hover:text-blue-700">
                  {resource.title}
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </a>
          ))}
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="text-center">
          <Github className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Contribute to the Community</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Help improve these implementations! Submit your optimizations, bug fixes, or additional language examples.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              View on GitHub
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Submit Improvement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}