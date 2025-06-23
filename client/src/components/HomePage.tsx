import React from 'react';
import { BookOpen, Code, Brain, FileText, Users, Heart, Target, Clock, Award, Lightbulb } from 'lucide-react';

interface HomePageProps {
  dataStructures: any[];
  userProgress: Record<string, number>;
  onDataStructureSelect: (id: any) => void;
}

export function HomePage({ dataStructures, userProgress, onDataStructureSelect }: HomePageProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get featured data structures (first 6)
  const featuredStructures = dataStructures.slice(0, 6);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Data Structures Academy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Master fundamental data structures through interactive visualizations, comprehensive notes, 
            challenging quizzes, and real-world implementation examples. Your journey to algorithmic excellence starts here.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Code className="h-4 w-4 text-blue-600" />
              <span>Interactive Demos</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Brain className="h-4 w-4 text-purple-600" />
              <span>Practice Quizzes</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <FileText className="h-4 w-4 text-green-600" />
              <span>Study Materials</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Users className="h-4 w-4 text-orange-600" />
              <span>Code Examples</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Data Structures */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Data Structures</h2>
          <p className="text-lg text-gray-600">
            Start your learning journey with these fundamental data structures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredStructures.map((structure) => {
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

        <div className="text-center">
          <button 
            onClick={() => onDataStructureSelect(null)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            View All Data Structures
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Learning Experience</h2>
            <p className="text-lg text-gray-600">
              Everything you need to master data structures and algorithms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Code,
                title: "Interactive Visualizations",
                description: "Watch data structures change in real-time as you perform operations",
                color: "bg-blue-500"
              },
              {
                icon: FileText,
                title: "Comprehensive Notes",
                description: "Detailed explanations, complexity analysis, and implementation details",
                color: "bg-green-500"
              },
              {
                icon: Brain,
                title: "Practice Quizzes",
                description: "Test your understanding with carefully crafted questions and challenges",
                color: "bg-purple-500"
              },
              {
                icon: Users,
                title: "Code Examples",
                description: "Real-world implementations in multiple programming languages",
                color: "bg-orange-500"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`${feature.color} p-4 rounded-2xl w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "12+", label: "Data Structures" },
              { number: "100+", label: "Practice Questions" },
              { number: "50+", label: "Code Examples" },
              { number: "∞", label: "Learning Opportunities" }
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students mastering data structures and algorithms through our interactive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onDataStructureSelect(dataStructures[0].id)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Start with Stack
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Browse All Topics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}