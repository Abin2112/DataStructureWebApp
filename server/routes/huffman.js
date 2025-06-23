import express from 'express';

const router = express.Router();
let huffmanInstances = new Map();

// Huffman Node class
class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

// Huffman Coding implementation
class HuffmanCoding {
  constructor(id) {
    this.id = id;
    this.tree = null;
    this.codes = {};
  }

  buildFrequencyTable(text) {
    const frequencies = {};
    for (const char of text) {
      frequencies[char] = (frequencies[char] || 0) + 1;
    }
    return frequencies;
  }

  buildHuffmanTree(frequencies) {
    const nodes = Object.entries(frequencies).map(([char, freq]) => 
      new HuffmanNode(char, freq)
    );

    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift();
      const right = nodes.shift();
      const merged = new HuffmanNode(null, left.freq + right.freq, left, right);
      nodes.push(merged);
    }

    return nodes[0] || null;
  }

  generateCodes(node, code = '', codes = {}) {
    if (!node) return codes;

    if (node.char !== null) {
      codes[node.char] = code || '0';
      return codes;
    }

    this.generateCodes(node.left, code + '0', codes);
    this.generateCodes(node.right, code + '1', codes);
    return codes;
  }

  encode(text) {
    if (!text) return { encoded: '', codes: {}, tree: null };

    const frequencies = this.buildFrequencyTable(text);
    this.tree = this.buildHuffmanTree(frequencies);
    this.codes = this.generateCodes(this.tree);

    const encoded = text.split('').map(char => this.codes[char] || '').join('');
    
    return {
      tree: this.tree,
      codes: this.codes,
      encoded,
      originalSize: text.length * 8,
      compressedSize: encoded.length,
      compressionRatio: ((text.length * 8 - encoded.length) / (text.length * 8)) * 100
    };
  }

  decode(encoded) {
    if (!this.tree || !encoded) return '';

    let decoded = '';
    let current = this.tree;

    for (const bit of encoded) {
      current = bit === '0' ? current.left : current.right;
      
      if (current.char !== null) {
        decoded += current.char;
        current = this.tree;
      }
    }

    return decoded;
  }
}

// Create Huffman coding instance
router.post('/create/:id', (req, res) => {
  const { id } = req.params;
  const huffman = new HuffmanCoding(id);
  huffmanInstances.set(id, huffman);
  res.json({ success: true, message: 'Huffman coding instance created' });
});

// Encode text
router.post('/:id/encode', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const huffman = huffmanInstances.get(id);
  
  if (!huffman) {
    return res.status(404).json({ error: 'Huffman instance not found' });
  }

  try {
    const result = huffman.encode(text);
    res.json({ 
      success: true, 
      result,
      message: `Text encoded successfully. Compression ratio: ${result.compressionRatio.toFixed(1)}%`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Decode text
router.post('/:id/decode', (req, res) => {
  const { id } = req.params;
  const { encoded } = req.body;
  const huffman = huffmanInstances.get(id);
  
  if (!huffman) {
    return res.status(404).json({ error: 'Huffman instance not found' });
  }

  try {
    const decoded = huffman.decode(encoded);
    res.json({ 
      success: true, 
      decoded,
      message: 'Text decoded successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export { router as huffmanRoutes };