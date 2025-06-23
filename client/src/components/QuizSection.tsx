import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, XCircle, RotateCcw, Award, Clock, Target } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizSectionProps {
  dataStructure: {
    id: string;
    name: string;
    difficulty: string;
  };
  onProgressUpdate: (score: number) => void;
}

const quizData: Record<string, Question[]> = {
  stack: [
    {
      id: 1,
      question: "What does LIFO stand for in the context of stacks?",
      options: ["Last In First Out", "Last In Final Out", "Latest In First Out", "Linear In First Out"],
      correctAnswer: 0,
      explanation: "LIFO stands for Last In First Out, meaning the last element added to the stack is the first one to be removed.",
      difficulty: 'easy'
    },
    {
      id: 2,
      question: "What is the time complexity of push and pop operations in a stack?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correctAnswer: 2,
      explanation: "Both push and pop operations in a stack have O(1) time complexity as they only involve adding or removing from the top.",
      difficulty: 'medium'
    },
    {
      id: 3,
      question: "Which of the following is NOT a typical use case for stacks?",
      options: ["Function call management", "Undo operations", "Expression evaluation", "Finding shortest path"],
      correctAnswer: 3,
      explanation: "Finding shortest path typically uses algorithms like Dijkstra's or BFS, which use queues or priority queues, not stacks.",
      difficulty: 'hard'
    },
    {
      id: 4,
      question: "In a stack implementation using arrays, what happens when you try to push to a full stack?",
      options: ["The oldest element is removed", "Stack overflow occurs", "The operation is ignored", "Stack automatically resizes"],
      correctAnswer: 1,
      explanation: "When trying to push to a full stack, a stack overflow condition occurs, which should be handled appropriately.",
      difficulty: 'medium'
    },
    {
      id: 5,
      question: "What will be the output if we push 1, 2, 3 and then pop twice?",
      options: ["1, 2", "3, 2", "2, 3", "1, 3"],
      correctAnswer: 1,
      explanation: "Stack follows LIFO, so after pushing 1, 2, 3, the stack has [1, 2, 3] with 3 on top. Two pops will return 3, then 2.",
      difficulty: 'easy'
    }
  ],
  queue: [
    {
      id: 1,
      question: "What does FIFO stand for in the context of queues?",
      options: ["First In First Out", "Final In First Out", "First In Final Out", "Fast In First Out"],
      correctAnswer: 0,
      explanation: "FIFO stands for First In First Out, meaning the first element added to the queue is the first one to be removed.",
      difficulty: 'easy'
    },
    {
      id: 2,
      question: "What are the two main operations of a queue?",
      options: ["Push and Pop", "Insert and Delete", "Enqueue and Dequeue", "Add and Remove"],
      correctAnswer: 2,
      explanation: "The two main operations of a queue are enqueue (add to rear) and dequeue (remove from front).",
      difficulty: 'easy'
    },
    {
      id: 3,
      question: "In which scenario would you prefer a queue over a stack?",
      options: ["Undo operations", "Function calls", "Breadth-first search", "Expression evaluation"],
      correctAnswer: 2,
      explanation: "Breadth-first search uses a queue to explore nodes level by level, which requires FIFO behavior.",
      difficulty: 'medium'
    },
    {
      id: 4,
      question: "What is the time complexity of enqueue and dequeue operations in a queue?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correctAnswer: 2,
      explanation: "Both enqueue and dequeue operations have O(1) time complexity when implemented efficiently.",
      difficulty: 'medium'
    },
    {
      id: 5,
      question: "In a circular queue, what advantage does it have over a linear queue?",
      options: ["Faster operations", "Better memory utilization", "Simpler implementation", "No overflow"],
      correctAnswer: 1,
      explanation: "Circular queues provide better memory utilization by reusing empty spaces created by dequeue operations.",
      difficulty: 'hard'
    }
  ],
  'binary-tree': [
    {
      id: 1,
      question: "In a Binary Search Tree, what property must be maintained?",
      options: [
        "Left child > Parent > Right child",
        "Left child < Parent < Right child", 
        "All leaves at same level",
        "Complete binary tree structure"
      ],
      correctAnswer: 1,
      explanation: "In a BST, for any node, all values in the left subtree are less than the node's value, and all values in the right subtree are greater.",
      difficulty: 'easy'
    },
    {
      id: 2,
      question: "What traversal of a BST gives elements in sorted order?",
      options: ["Preorder", "Inorder", "Postorder", "Level order"],
      correctAnswer: 1,
      explanation: "Inorder traversal (Left-Root-Right) of a BST visits nodes in ascending sorted order.",
      difficulty: 'medium'
    },
    {
      id: 3,
      question: "What is the average time complexity for search in a balanced BST?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      correctAnswer: 1,
      explanation: "In a balanced BST, search operations have O(log n) average time complexity due to the tree's height being logarithmic.",
      difficulty: 'medium'
    },
    {
      id: 4,
      question: "When deleting a node with two children in a BST, which strategy is commonly used?",
      options: [
        "Replace with left child",
        "Replace with right child",
        "Replace with inorder successor",
        "Remove the entire subtree"
      ],
      correctAnswer: 2,
      explanation: "When deleting a node with two children, it's commonly replaced with its inorder successor (or predecessor) to maintain BST property.",
      difficulty: 'hard'
    },
    {
      id: 5,
      question: "What happens to BST performance in the worst case (completely unbalanced)?",
      options: ["Becomes O(1)", "Becomes O(log n)", "Becomes O(n)", "Becomes O(n²)"],
      correctAnswer: 2,
      explanation: "In the worst case, a BST becomes a linear chain, making search, insert, and delete operations O(n).",
      difficulty: 'hard'
    }
  ],
  'hash-table': [
    {
      id: 1,
      question: "What is the primary purpose of a hash function?",
      options: [
        "Sort the data",
        "Encrypt the data",
        "Map keys to array indices",
        "Compress the data"
      ],
      correctAnswer: 2,
      explanation: "A hash function maps keys to array indices, allowing for fast access to stored values.",
      difficulty: 'easy'
    },
    {
      id: 2,
      question: "What is a collision in hash tables?",
      options: [
        "When the table is full",
        "When two keys hash to the same index",
        "When a key is not found",
        "When the hash function fails"
      ],
      correctAnswer: 1,
      explanation: "A collision occurs when two different keys produce the same hash value, mapping to the same array index.",
      difficulty: 'easy'
    },
    {
      id: 3,
      question: "Which collision resolution technique uses linked lists?",
      options: ["Linear probing", "Quadratic probing", "Separate chaining", "Double hashing"],
      correctAnswer: 2,
      explanation: "Separate chaining resolves collisions by maintaining a linked list at each array index to store multiple key-value pairs.",
      difficulty: 'medium'
    },
    {
      id: 4,
      question: "What is the load factor in a hash table?",
      options: [
        "Number of collisions",
        "Size of the table",
        "Ratio of elements to table size",
        "Number of hash functions"
      ],
      correctAnswer: 2,
      explanation: "Load factor is the ratio of the number of elements stored to the total size of the hash table.",
      difficulty: 'medium'
    },
    {
      id: 5,
      question: "When does linear probing perform poorly?",
      options: [
        "When load factor is low",
        "When there are many collisions",
        "When keys are strings",
        "When table size is prime"
      ],
      correctAnswer: 1,
      explanation: "Linear probing performs poorly when there are many collisions, leading to clustering and longer search times.",
      difficulty: 'hard'
    }
  ]
};

export function QuizSection({ dataStructure, onProgressUpdate }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  const questions = quizData[dataStructure.id] || [];

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleQuizComplete();
    }
  }, [timeLeft, quizStarted, quizCompleted]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers(new Array(questions.length).fill(null));
    setQuizCompleted(false);
    setTimeLeft(300);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    const finalScore = Math.round((score / questions.length) * 100);
    onProgressUpdate(finalScore);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
    setTimeLeft(300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz Coming Soon</h3>
        <p className="text-gray-600">
          We're preparing an awesome quiz for {dataStructure.name}. Check back soon!
        </p>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-4">
              <Brain className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {dataStructure.name} Quiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Test your understanding of {dataStructure.name} with our comprehensive quiz. 
              You'll have 5 minutes to answer {questions.length} questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-sm text-blue-700">Questions</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">5:00</div>
              <div className="text-sm text-purple-700">Time Limit</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">70%</div>
              <div className="text-sm text-green-700">Pass Score</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Difficulty Breakdown</h3>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(q.difficulty)}`}
                >
                  Q{index + 1}: {q.difficulty}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startQuiz}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className={`p-4 rounded-2xl w-20 h-20 mx-auto mb-4 ${passed ? 'bg-green-500' : 'bg-red-500'}`}>
              {passed ? (
                <Award className="h-12 w-12 text-white" />
              ) : (
                <XCircle className="h-12 w-12 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-lg text-gray-600">
              You scored {score} out of {questions.length} questions correctly
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Your Score</span>
              <span className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${passed ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-center">
              <span className={`text-sm font-medium ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {passed ? 'Congratulations! You passed!' : 'Keep studying and try again!'}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900">Review Your Answers</h3>
            {questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-2">
                        Q{index + 1}: {question.question}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Your answer: {userAnswer !== null ? question.options[userAnswer] : 'Not answered'}
                      </div>
                      {!isCorrect && (
                        <div className="text-sm text-green-600 mb-2">
                          Correct answer: {question.options[question.correctAnswer]}
                        </div>
                      )}
                      <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {question.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={resetQuiz}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span className={timeLeft < 60 ? 'text-red-600 font-semibold' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                  ${selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                    }
                  `}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Score: {score}/{currentQuestion + (selectedAnswer !== null ? 1 : 0)}
          </div>
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}