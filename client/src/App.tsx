import React, { useState } from 'react';
import { BookOpen, Database, Layers, Network, Hash, User, Brain, FileText, Award, Code, Users, Lightbulb, Binary, MapPin } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { StackVisualizer } from './components/StackVisualizer';
import { LinkedListVisualizer } from './components/LinkedListVisualizer';
import { QueueVisualizer } from './components/QueueVisualizer';
import { PriorityQueueVisualizer } from './components/PriorityQueueVisualizer';
import { BinaryTreeVisualizer } from './components/BinaryTreeVisualizer';
import { GraphVisualizer } from './components/GraphVisualizer';
import { HashTableVisualizer } from './components/HashTableVisualizer';
import { HuffmanCodingVisualizer } from './components/HuffmanCodingVisualizer';
import { TSPVisualizer } from './components/TSPVisualizer';
import { QuizSection } from './components/QuizSection';
import { NotesSection } from './components/NotesSection';
import { DeveloperSection } from './components/DeveloperSection';

type DataStructure = 
  | 'stack' 
  | 'singly-linked-list' 
  | 'doubly-linked-list' 
  | 'queue' 
  | 'priority-queue'
  | 'heap-priority-queue'
  | 'binary-tree'
  | 'graph'
  | 'hash-table'
  | 'hash-table-linear-probing'
  | 'huffman-coding'
  | 'tsp';

type ViewMode = 'visualizer' | 'quiz' | 'notes' | 'developer';
type Page = 'home' | 'data-structures' | 'about' | 'contact';

const dataStructures = [
  {
    id: 'stack' as const,
    name: 'Stack',
    description: 'Last In, First Out (LIFO) data structure',
    icon: Layers,
    color: 'bg-purple-500',
    difficulty: 'Beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    realWorldUse: 'Function calls, undo operations, expression evaluation'
  },
  {
    id: 'singly-linked-list' as const,
    name: 'Singly Linked List',
    description: 'Linear collection of nodes with forward pointers',
    icon: Database,
    color: 'bg-blue-500',
    difficulty: 'Beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    realWorldUse: 'Dynamic memory allocation, music playlists'
  },
  {
    id: 'doubly-linked-list' as const,
    name: 'Doubly Linked List',
    description: 'Linear collection with bidirectional pointers',
    icon: Database,
    color: 'bg-indigo-500',
    difficulty: 'Intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    realWorldUse: 'Browser history, text editors with undo/redo'
  },
  {
    id: 'queue' as const,
    name: 'Queue',
    description: 'First In, First Out (FIFO) data structure',
    icon: Layers,
    color: 'bg-green-500',
    difficulty: 'Beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    realWorldUse: 'Task scheduling, breadth-first search, print queues'
  },
  {
    id: 'priority-queue' as const,
    name: 'Priority Queue',
    description: 'Queue where elements have priorities',
    icon: Layers,
    color: 'bg-yellow-500',
    difficulty: 'Intermediate',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    realWorldUse: 'CPU scheduling, Dijkstra\'s algorithm, emergency room triage'
  },
  {
    id: 'heap-priority-queue' as const,
    name: 'Heap Priority Queue',
    description: 'Heap-based priority queue implementation',
    icon: Layers,
    color: 'bg-orange-500',
    difficulty: 'Advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    realWorldUse: 'Heap sort, graph algorithms, operating systems'
  },
  {
    id: 'binary-tree' as const,
    name: 'Binary Search Tree',
    description: 'Tree structure with ordered node arrangement',
    icon: Network,
    color: 'bg-teal-500',
    difficulty: 'Intermediate',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    realWorldUse: 'Database indexing, file systems, expression parsing'
  },
  {
    id: 'graph' as const,
    name: 'Graph',
    description: 'Collection of vertices connected by edges',
    icon: Network,
    color: 'bg-cyan-500',
    difficulty: 'Advanced',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    realWorldUse: 'Social networks, GPS navigation, web crawling'
  },
  {
    id: 'hash-table' as const,
    name: 'Hash Table (Chaining)',
    description: 'Key-value store with collision handling via chaining',
    icon: Hash,
    color: 'bg-pink-500',
    difficulty: 'Intermediate',
    timeComplexity: 'O(1) avg',
    spaceComplexity: 'O(n)',
    realWorldUse: 'Database indexing, caching, symbol tables'
  },
  {
    id: 'hash-table-linear-probing' as const,
    name: 'Hash Table (Linear Probing)',
    description: 'Key-value store with linear probing collision resolution',
    icon: Hash,
    color: 'bg-rose-500',
    difficulty: 'Advanced',
    timeComplexity: 'O(1) avg',
    spaceComplexity: 'O(n)',
    realWorldUse: 'Compilers, databases, distributed systems'
  },
  {
    id: 'huffman-coding' as const,
    name: 'Huffman Coding',
    description: 'Optimal prefix-free encoding for data compression',
    icon: Binary,
    color: 'bg-emerald-500',
    difficulty: 'Advanced',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    realWorldUse: 'File compression, data transmission, ZIP files'
  },
  {
    id: 'tsp' as const,
    name: 'Travelling Salesman Problem',
    description: 'Find shortest route visiting all cities exactly once',
    icon: MapPin,
    color: 'bg-violet-500',
    difficulty: 'Advanced',
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n)',
    realWorldUse: 'Route optimization, circuit design, logistics planning'
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedStructure, setSelectedStructure] = useState<DataStructure | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('visualizer');
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setSelectedStructure(null);
    setIsMenuOpen(false);
  };

  const handleDataStructureSelect = (structureId: DataStructure) => {
    setSelectedStructure(structureId);
    setCurrentPage('data-structures');
    setViewMode('visualizer');
  };

  const renderContent = () => {
    if (selectedStructure) {
      const structure = dataStructures.find(ds => ds.id === selectedStructure);
      if (!structure) return null;

      switch (viewMode) {
        case 'visualizer':
          return renderVisualizer();
        case 'quiz':
          return <QuizSection 
            dataStructure={structure} 
            onProgressUpdate={(score) => {
              setUserProgress(prev => ({
                ...prev,
                [selectedStructure]: score
              }));
            }}
          />;
        case 'notes':
          return <NotesSection dataStructure={structure} />;
        case 'developer':
          return <DeveloperSection dataStructure={structure} />;
        default:
          return null;
      }
    }

    switch (currentPage) {
      case 'home':
        return <HomePage 
          dataStructures={dataStructures} 
          userProgress={userProgress}
          onDataStructureSelect={handleDataStructureSelect}
        />;
      case 'data-structures':
        return <DataStructuresPage 
          dataStructures={dataStructures} 
          userProgress={userProgress}
          onDataStructureSelect={handleDataStructureSelect}
        />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage 
          dataStructures={dataStructures} 
          userProgress={userProgress}
          onDataStructureSelect={handleDataStructureSelect}
        />;
    }
  };

  const renderVisualizer = () => {
    switch (selectedStructure) {
      case 'stack':
        return <StackVisualizer />;
      case 'singly-linked-list':
        return <LinkedListVisualizer type="singly" />;
      case 'doubly-linked-list':
        return <LinkedListVisualizer type="doubly" />;
      case 'queue':
        return <QueueVisualizer />;
      case 'priority-queue':
        return <PriorityQueueVisualizer type="basic" />;
      case 'heap-priority-queue':
        return <PriorityQueueVisualizer type="heap" />;
      case 'binary-tree':
        return <BinaryTreeVisualizer />;
      case 'graph':
        return <GraphVisualizer />;
      case 'hash-table':
        return <HashTableVisualizer type="chaining" />;
      case 'hash-table-linear-probing':
        return <HashTableVisualizer type="linear-probing" />;
      case 'huffman-coding':
        return <HuffmanCodingVisualizer />;
      case 'tsp':
        return <TSPVisualizer />;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (selectedStructure) {
    const structure = dataStructures.find(ds => ds.id === selectedStructure);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Header 
          currentPage={currentPage}
          onNavigate={handleNavigation}
          isMenuOpen={isMenuOpen} 
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)} 
        />
        
        {/* Sub Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setSelectedStructure(null)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <BookOpen className="h-6 w-6 mr-2" />
                <span className="font-semibold">Back to Data Structures</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {structure?.name}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(structure?.difficulty || '')}`}>
                  {structure?.difficulty}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { id: 'visualizer', label: 'Interactive Demo', icon: Code },
                { id: 'notes', label: 'Study Notes', icon: FileText },
                { id: 'quiz', label: 'Quiz & Practice', icon: Brain },
                { id: 'developer', label: 'Implementation', icon: Users }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id as ViewMode)}
                  className={`
                    flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors
                    ${viewMode === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </div>

        <Footer onNavigate={handleNavigation} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Header 
        currentPage={currentPage}
        onNavigate={handleNavigation}
        isMenuOpen={isMenuOpen} 
        onMenuClick={() => setIsMenuOpen(!isMenuOpen)} 
      />
      
      <div className="flex-1">
        {renderContent()}
      </div>

      <Footer onNavigate={handleNavigation} />
    </div>
  );
}

// Data Structures Page Component
function DataStructuresPage({ 
  dataStructures, 
  userProgress, 
  onDataStructureSelect 
}: {
  dataStructures: any[];
  userProgress: Record<string, number>;
  onDataStructureSelect: (id: DataStructure) => void;
}) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Structures</h1>
        <p className="text-lg text-gray-600">
          Explore and master fundamental data structures through interactive learning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dataStructures.map((structure) => {
          const IconComponent = structure.icon;
          const progress = userProgress[structure.id] || 0;
          
          return (
            <div
              key={structure.id}
              onClick={() => onDataStructureSelect(structure.id)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${structure.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(structure.difficulty)}`}>
                    {structure.difficulty}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {structure.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {structure.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Time Complexity:</span>
                    <span className="font-mono font-semibold text-blue-600">{structure.timeComplexity}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Space Complexity:</span>
                    <span className="font-mono font-semibold text-purple-600">{structure.spaceComplexity}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Real-world use:</div>
                  <div className="text-xs text-gray-700">{structure.realWorldUse}</div>
                </div>

                {progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Quiz Progress</span>
                      <span className="text-green-600 font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 group-hover:bg-blue-100 group-hover:text-blue-800 transition-colors">
                    Start Learning →
                  </span>
                  {progress === 100 && (
                    <Award className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;