import React, { useState, useEffect } from 'react';
import { Plus, FileText, Trash2, AlertCircle, Binary, TreePine } from 'lucide-react';

interface HuffmanNode {
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
  code?: string;
}

interface HuffmanResult {
  tree: HuffmanNode | null;
  codes: Record<string, string>;
  encoded: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export function HuffmanCodingVisualizer() {
  const [inputText, setInputText] = useState('');
  const [huffmanResult, setHuffmanResult] = useState<HuffmanResult | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'frequency' | 'tree' | 'codes' | 'result'>('input');

  useEffect(() => {
    initializeHuffman();
  }, []);

  const initializeHuffman = async () => {
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/huffman/create/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setMessage(data.message || 'Huffman Coding initialized');
    } catch (error) {
      setMessage('Failed to initialize Huffman Coding');
    }
  };

  const handleEncode = async () => {
    if (!inputText.trim()) {
      setMessage('Please enter some text to encode');
      return;
    }
    
    setIsLoading(true);
    setStep('frequency');
    
    try {
      const response = await fetch('https://datastructurewebapp.onrender.com/api/huffman/demo/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText.trim() })
      });
      
      const data = await response.json();
      if (data.success) {
        setHuffmanResult(data.result);
        setMessage(data.message);
        setStep('result');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      // Simulate Huffman encoding for demo
      const result = simulateHuffmanEncoding(inputText.trim());
      setHuffmanResult(result);
      setMessage('Text encoded successfully using Huffman Coding');
      setStep('result');
    }
    setIsLoading(false);
  };

  const simulateHuffmanEncoding = (text: string): HuffmanResult => {
    // Calculate character frequencies
    const frequencies: Record<string, number> = {};
    for (const char of text) {
      frequencies[char] = (frequencies[char] || 0) + 1;
    }

    // Create leaf nodes
    const nodes: HuffmanNode[] = Object.entries(frequencies).map(([char, freq]) => ({
      char,
      freq,
      left: null,
      right: null
    }));

    // Build Huffman tree (simplified simulation)
    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift()!;
      const right = nodes.shift()!;
      
      const merged: HuffmanNode = {
        char: null,
        freq: left.freq + right.freq,
        left,
        right
      };
      
      nodes.push(merged);
    }

    const tree = nodes[0] || null;
    
    // Generate codes
    const codes: Record<string, string> = {};
    const generateCodes = (node: HuffmanNode | null, code: string = '') => {
      if (!node) return;
      
      if (node.char !== null) {
        codes[node.char] = code || '0';
        return;
      }
      
      generateCodes(node.left, code + '0');
      generateCodes(node.right, code + '1');
    };
    
    generateCodes(tree);

    // Encode text
    const encoded = text.split('').map(char => codes[char] || '').join('');
    
    const originalSize = text.length * 8; // 8 bits per character
    const compressedSize = encoded.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    return {
      tree,
      codes,
      encoded,
      originalSize,
      compressedSize,
      compressionRatio
    };
  };

  const handleClear = () => {
    setInputText('');
    setHuffmanResult(null);
    setMessage('');
    setStep('input');
  };

  const renderHuffmanTree = (node: HuffmanNode | null, level: number = 0): JSX.Element | null => {
    if (!node) return null;

    return (
      <div className="flex flex-col items-center">
        <div
          className={`
            w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 text-xs font-mono
            ${node.char !== null 
              ? 'bg-green-100 border-green-300 text-green-800' 
              : 'bg-blue-100 border-blue-300 text-blue-800'
            }
          `}
        >
          <div className="font-semibold">
            {node.char !== null ? `'${node.char}'` : 'Node'}
          </div>
          <div className="text-xs">{node.freq}</div>
        </div>
        
        {(node.left || node.right) && (
          <div className="flex mt-4 space-x-8">
            <div className="flex flex-col items-center">
              {node.left && (
                <>
                  <div className="w-px h-4 bg-gray-400"></div>
                  <div className="w-8 h-px bg-gray-400"></div>
                  <div className="w-px h-4 bg-gray-400"></div>
                  <div className="text-xs text-gray-600 mb-2">0</div>
                  {renderHuffmanTree(node.left, level + 1)}
                </>
              )}
            </div>
            
            <div className="flex flex-col items-center">
              {node.right && (
                <>
                  <div className="w-px h-4 bg-gray-400"></div>
                  <div className="w-8 h-px bg-gray-400"></div>
                  <div className="w-px h-4 bg-gray-400"></div>
                  <div className="text-xs text-gray-600 mb-2">1</div>
                  {renderHuffmanTree(node.right, level + 1)}
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Huffman Coding Visualizer</h2>
        
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text to Encode
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter text to compress using Huffman coding..."
                rows={4}
                disabled={isLoading}
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleEncode}
                  disabled={!inputText.trim() || isLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
                >
                  <Binary className="h-4 w-4" />
                  <span>Encode Text</span>
                </button>
                <button
                  onClick={handleClear}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Compression Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Input Length:</span>
                <span className="font-mono font-semibold">{inputText.length} chars</span>
              </div>
              {huffmanResult && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Size:</span>
                    <span className="font-mono font-semibold">{huffmanResult.originalSize} bits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compressed Size:</span>
                    <span className="font-mono font-semibold">{huffmanResult.compressedSize} bits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compression Ratio:</span>
                    <span className="font-mono font-semibold text-green-600">
                      {huffmanResult.compressionRatio.toFixed(1)}%
                    </span>
                  </div>
                </>
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

        {/* Results */}
        {huffmanResult && (
          <div className="space-y-6">
            {/* Character Codes */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Character Codes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(huffmanResult.codes).map(([char, code]) => (
                  <div key={char} className="bg-white rounded-lg p-3 border">
                    <div className="text-center">
                      <div className="font-mono font-semibold text-lg text-gray-900">
                        '{char === ' ' ? '␣' : char}'
                      </div>
                      <div className="font-mono text-sm text-blue-600">{code}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Huffman Tree */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Huffman Tree</h3>
              <div className="flex justify-center overflow-x-auto">
                {huffmanResult.tree ? (
                  <div className="py-4">
                    {renderHuffmanTree(huffmanResult.tree)}
                  </div>
                ) : (
                  <div className="text-gray-500 py-8">No tree to display</div>
                )}
              </div>
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-200 rounded"></div>
                    <span>Leaf Node (Character)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-200 rounded"></div>
                    <span>Internal Node</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Encoded Result */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Encoded Result</h3>
              <div className="bg-white rounded-lg p-4 border">
                <div className="font-mono text-sm break-all text-blue-600">
                  {huffmanResult.encoded}
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Original: "{inputText}" → Encoded: {huffmanResult.encoded.length} bits
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Guide */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Huffman Coding Algorithm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-green-700 mb-1">Step 1: Frequency Analysis</div>
              <div className="text-gray-600">Count frequency of each character in the input text</div>
            </div>
            <div>
              <div className="font-semibold text-blue-700 mb-1">Step 2: Build Tree</div>
              <div className="text-gray-600">Create binary tree with least frequent characters deeper</div>
            </div>
            <div>
              <div className="font-semibold text-purple-700 mb-1">Step 3: Generate Codes</div>
              <div className="text-gray-600">Assign binary codes based on tree paths (0=left, 1=right)</div>
            </div>
            <div>
              <div className="font-semibold text-orange-700 mb-1">Step 4: Encode</div>
              <div className="text-gray-600">Replace each character with its corresponding binary code</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
