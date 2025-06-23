import express from 'express';

const router = express.Router();
let binaryTrees = new Map();

// Binary Tree Node
class TreeNode {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

// Binary Tree implementation
class BinaryTree {
  constructor(id) {
    this.id = id;
    this.root = null;
  }

  insert(data) {
    this.root = this.insertNode(this.root, data);
    return this.getTreeStructure();
  }

  insertNode(node, data) {
    if (node === null) {
      return new TreeNode(data);
    }

    if (data < node.data) {
      node.left = this.insertNode(node.left, data);
    } else if (data > node.data) {
      node.right = this.insertNode(node.right, data);
    }

    return node;
  }

  delete(data) {
    this.root = this.deleteNode(this.root, data);
    return this.getTreeStructure();
  }

  deleteNode(node, data) {
    if (node === null) {
      return null;
    }

    if (data < node.data) {
      node.left = this.deleteNode(node.left, data);
    } else if (data > node.data) {
      node.right = this.deleteNode(node.right, data);
    } else {
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      node.data = this.findMin(node.right);
      node.right = this.deleteNode(node.right, node.data);
    }

    return node;
  }

  findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node.data;
  }

  search(data) {
    return this.searchNode(this.root, data);
  }

  searchNode(node, data) {
    if (node === null) {
      return { found: false, path: [] };
    }

    const path = [node.data];

    if (data === node.data) {
      return { found: true, path };
    }

    if (data < node.data) {
      const result = this.searchNode(node.left, data);
      return { found: result.found, path: path.concat(result.path) };
    } else {
      const result = this.searchNode(node.right, data);
      return { found: result.found, path: path.concat(result.path) };
    }
  }

  inorderTraversal() {
    const result = [];
    this.inorder(this.root, result);
    return result;
  }

  inorder(node, result) {
    if (node !== null) {
      this.inorder(node.left, result);
      result.push(node.data);
      this.inorder(node.right, result);
    }
  }

  preorderTraversal() {
    const result = [];
    this.preorder(this.root, result);
    return result;
  }

  preorder(node, result) {
    if (node !== null) {
      result.push(node.data);
      this.preorder(node.left, result);
      this.preorder(node.right, result);
    }
  }

  postorderTraversal() {
    const result = [];
    this.postorder(this.root, result);
    return result;
  }

  postorder(node, result) {
    if (node !== null) {
      this.postorder(node.left, result);
      this.postorder(node.right, result);
      result.push(node.data);
    }
  }

  getTreeStructure() {
    return this.nodeToObject(this.root);
  }

  nodeToObject(node) {
    if (node === null) {
      return null;
    }

    return {
      data: node.data,
      left: this.nodeToObject(node.left),
      right: this.nodeToObject(node.right)
    };
  }

  clear() {
    this.root = null;
    return this.getTreeStructure();
  }
}

// Create binary tree
router.post('/create/:id', (req, res) => {
  const { id } = req.params;
  const tree = new BinaryTree(id);
  binaryTrees.set(id, tree);
  res.json({ success: true, tree: tree.getTreeStructure(), message: 'Binary tree created' });
});

// Get tree structure
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const tree = binaryTrees.get(id);
  if (!tree) {
    return res.status(404).json({ error: 'Binary tree not found' });
  }
  res.json({ tree: tree.getTreeStructure() });
});

// Insert node
router.post('/:id/insert', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const tree = binaryTrees.get(id);
  
  if (!tree) {
    return res.status(404).json({ error: 'Binary tree not found' });
  }

  const result = tree.insert(value);
  res.json({ 
    success: true, 
    tree: result, 
    message: `Inserted ${value}`
  });
});

// Delete node
router.post('/:id/delete', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const tree = binaryTrees.get(id);
  
  if (!tree) {
    return res.status(404).json({ error: 'Binary tree not found' });
  }

  const result = tree.delete(value);
  res.json({ 
    success: true, 
    tree: result, 
    message: `Deleted ${value}`
  });
});

// Search node
router.post('/:id/search', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const tree = binaryTrees.get(id);
  
  if (!tree) {
    return res.status(404).json({ error: 'Binary tree not found' });
  }

  const result = tree.search(value);
  res.json({ 
    success: true, 
    searchResult: result,
    message: result.found ? `Found ${value}` : `${value} not found`
  });
});

// Tree traversals
router.get('/:id/traversal/inorder', (req, res) => {
  const { id } = req.params;
  const tree = binaryTrees.get(id);
  
  if (!tree) {
    return res.status(404).json({ error: 'Binary tree not found' });
  }

  const result = tree.inorderTraversal();
  res.json({ traversal: result, type: 'inorder' });
});

router.get('/:id/traversal/preorder', (req, res) => {
  const { id } = req.params;
  const tree = binaryTrees.get(id);
  
  if (!tree) {
    return res.status(404).json({ error: 'Binary tree not found' });
  }

  const result = tree.preorderTraversal();
  res.json({ traversal: result, type: 'preorder' });
});

router.get('/:id/traversal/postorder', (req, res) => {
  const { id } = req.params;
  const tree = binaryTrees.get(id);
  
  if (!tree) {
    return res.status(404).json({ error: 'Binary tree not found' });
  }

  const result = tree.postorderTraversal();
  res.json({ traversal: result, type: 'postorder' });
});

// Clear tree
router.post('/:id/clear', (req, res) => {
  const { id } = req.params;
  const tree = binaryTrees.get(id);
  
  if (!tree) {
    return res.status(404).json({ error: 'Binary tree not found' });
  }

  const result = tree.clear();
  res.json({ 
    success: true, 
    tree: result, 
    message: 'Tree cleared'
  });
});

export { router as binaryTreeRoutes };