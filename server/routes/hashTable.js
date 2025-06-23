import express from 'express';

const router = express.Router();
let hashTables = new Map();

// Hash Table with basic collision handling
class HashTable {
  constructor(id, size = 10) {
    this.id = id;
    this.size = size;
    this.table = new Array(size);
    this.count = 0;
  }

  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % this.size;
  }

  set(key, value) {
    const index = this.hash(key);
    
    if (!this.table[index]) {
      this.table[index] = [];
    }

    const existingPair = this.table[index].find(pair => pair[0] === key);
    
    if (existingPair) {
      existingPair[1] = value;
    } else {
      this.table[index].push([key, value]);
      this.count++;
    }

    return this.getTableStructure();
  }

  get(key) {
    const index = this.hash(key);
    
    if (this.table[index]) {
      const pair = this.table[index].find(pair => pair[0] === key);
      return pair ? pair[1] : undefined;
    }
    
    return undefined;
  }

  delete(key) {
    const index = this.hash(key);
    
    if (this.table[index]) {
      const pairIndex = this.table[index].findIndex(pair => pair[0] === key);
      
      if (pairIndex !== -1) {
        this.table[index].splice(pairIndex, 1);
        this.count--;
        
        if (this.table[index].length === 0) {
          this.table[index] = undefined;
        }
      }
    }

    return this.getTableStructure();
  }

  getTableStructure() {
    const structure = [];
    
    for (let i = 0; i < this.size; i++) {
      structure.push({
        index: i,
        bucket: this.table[i] || null,
        hasCollision: this.table[i] && this.table[i].length > 1
      });
    }

    return {
      table: structure,
      size: this.size,
      count: this.count,
      loadFactor: (this.count / this.size).toFixed(2)
    };
  }

  clear() {
    this.table = new Array(this.size);
    this.count = 0;
    return this.getTableStructure();
  }
}

// Hash Table with Linear Probing
class LinearProbingHashTable {
  constructor(id, size = 10) {
    this.id = id;
    this.size = size;
    this.keys = new Array(size);
    this.values = new Array(size);
    this.count = 0;
  }

  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % this.size;
  }

  set(key, value) {
    if (this.count >= this.size) {
      throw new Error('Hash table is full');
    }

    let index = this.hash(key);
    
    // Linear probing for collision resolution
    while (this.keys[index] !== undefined && this.keys[index] !== key) {
      index = (index + 1) % this.size;
    }

    // If key doesn't exist, increment count
    if (this.keys[index] === undefined) {
      this.count++;
    }

    this.keys[index] = key;
    this.values[index] = value;

    return this.getTableStructure();
  }

  get(key) {
    let index = this.hash(key);
    
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        return this.values[index];
      }
      index = (index + 1) % this.size;
    }

    return undefined;
  }

  delete(key) {
    let index = this.hash(key);
    
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        this.keys[index] = undefined;
        this.values[index] = undefined;
        this.count--;
        
        // Rehash subsequent entries
        index = (index + 1) % this.size;
        while (this.keys[index] !== undefined) {
          const keyToRehash = this.keys[index];
          const valueToRehash = this.values[index];
          
          this.keys[index] = undefined;
          this.values[index] = undefined;
          this.count--;
          
          this.set(keyToRehash, valueToRehash);
          index = (index + 1) % this.size;
        }
        
        break;
      }
      index = (index + 1) % this.size;
    }

    return this.getTableStructure();
  }

  getTableStructure() {
    const structure = [];
    
    for (let i = 0; i < this.size; i++) {
      structure.push({
        index: i,
        key: this.keys[i] || null,
        value: this.values[i] || null,
        isEmpty: this.keys[i] === undefined,
        originalIndex: this.keys[i] ? this.hash(this.keys[i]) : null
      });
    }

    return {
      table: structure,
      size: this.size,
      count: this.count,
      loadFactor: (this.count / this.size).toFixed(2)
    };
  }

  clear() {
    this.keys = new Array(this.size);
    this.values = new Array(this.size);
    this.count = 0;
    return this.getTableStructure();
  }
}

// Create hash table with chaining
router.post('/create/:id', (req, res) => {
  const { id } = req.params;
  const { size = 10 } = req.body;
  const hashTable = new HashTable(id, size);
  hashTables.set(id, hashTable);
  res.json({ 
    success: true, 
    hashTable: hashTable.getTableStructure(), 
    message: 'Hash table created with chaining' 
  });
});

// Create hash table with linear probing
router.post('/linear-probing/create/:id', (req, res) => {
  const { id } = req.params;
  const { size = 10 } = req.body;
  const hashTable = new LinearProbingHashTable(id, size);
  hashTables.set(`lp-${id}`, hashTable);
  res.json({ 
    success: true, 
    hashTable: hashTable.getTableStructure(), 
    message: 'Hash table created with linear probing' 
  });
});

// Basic hash table operations
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const hashTable = hashTables.get(id);
  if (!hashTable) {
    return res.status(404).json({ error: 'Hash table not found' });
  }
  res.json({ hashTable: hashTable.getTableStructure() });
});

router.post('/:id/set', (req, res) => {
  const { id } = req.params;
  const { key, value } = req.body;
  const hashTable = hashTables.get(id);
  
  if (!hashTable) {
    return res.status(404).json({ error: 'Hash table not found' });
  }

  try {
    const result = hashTable.set(key, value);
    res.json({ 
      success: true, 
      hashTable: result, 
      message: `Set ${key} = ${value}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/get', (req, res) => {
  const { id } = req.params;
  const { key } = req.body;
  const hashTable = hashTables.get(id);
  
  if (!hashTable) {
    return res.status(404).json({ error: 'Hash table not found' });
  }

  const value = hashTable.get(key);
  res.json({ 
    success: true, 
    key,
    value,
    found: value !== undefined,
    message: value !== undefined ? `Found ${key} = ${value}` : `Key ${key} not found`
  });
});

router.post('/:id/delete', (req, res) => {
  const { id } = req.params;
  const { key } = req.body;
  const hashTable = hashTables.get(id);
  
  if (!hashTable) {
    return res.status(404).json({ error: 'Hash table not found' });
  }

  const result = hashTable.delete(key);
  res.json({ 
    success: true, 
    hashTable: result, 
    message: `Deleted ${key}`
  });
});

// Linear probing hash table operations
router.get('/linear-probing/:id', (req, res) => {
  const { id } = req.params;
  const hashTable = hashTables.get(`lp-${id}`);
  if (!hashTable) {
    return res.status(404).json({ error: 'Hash table not found' });
  }
  res.json({ hashTable: hashTable.getTableStructure() });
});

router.post('/linear-probing/:id/set', (req, res) => {
  const { id } = req.params;
  const { key, value } = req.body;
  const hashTable = hashTables.get(`lp-${id}`);
  
  if (!hashTable) {
    return res.status(404).json({ error: 'Hash table not found' });
  }

  try {
    const result = hashTable.set(key, value);
    res.json({ 
      success: true, 
      hashTable: result, 
      message: `Set ${key} = ${value}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/linear-probing/:id/get', (req, res) => {
  const { id } = req.params;
  const { key } = req.body;
  const hashTable = hashTables.get(`lp-${id}`);
  
  if (!hashTable) {
    return res.status(404).json({ error: 'Hash table not found' });
  }

  const value = hashTable.get(key);
  res.json({ 
    success: true, 
    key,
    value,
    found: value !== undefined,
    message: value !== undefined ? `Found ${key} = ${value}` : `Key ${key} not found`
  });
});

router.post('/linear-probing/:id/delete', (req, res) => {
  const { id } = req.params;
  const { key } = req.body;
  const hashTable = hashTables.get(`lp-${id}`);
  
  if (!hashTable) {
    return res.status(404).json({ error: 'Hash table not found' });
  }

  const result = hashTable.delete(key);
  res.json({ 
    success: true, 
    hashTable: result, 
    message: `Deleted ${key}`
  });
});

export { router as hashTableRoutes };