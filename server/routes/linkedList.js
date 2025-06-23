import express from 'express';

const router = express.Router();
let linkedLists = new Map();

// Node class
class ListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// Doubly linked list node
class DoublyListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

// Singly Linked List
class SinglyLinkedList {
  constructor(id) {
    this.id = id;
    this.head = null;
    this.size = 0;
  }

  append(data) {
    const newNode = new ListNode(data);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
    return this.toArray();
  }

  prepend(data) {
    const newNode = new ListNode(data);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
    return this.toArray();
  }

  delete(data) {
    if (!this.head) return this.toArray();

    if (this.head.data === data) {
      this.head = this.head.next;
      this.size--;
      return this.toArray();
    }

    let current = this.head;
    while (current.next && current.next.data !== data) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      this.size--;
    }
    return this.toArray();
  }

  find(data) {
    let current = this.head;
    let index = 0;
    while (current) {
      if (current.data === data) {
        return { found: true, index, data: current.data };
      }
      current = current.next;
      index++;
    }
    return { found: false, index: -1, data: null };
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  clear() {
    this.head = null;
    this.size = 0;
    return this.toArray();
  }
}

// Doubly Linked List
class DoublyLinkedList {
  constructor(id) {
    this.id = id;
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(data) {
    const newNode = new DoublyListNode(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.size++;
    return this.toArrayWithLinks();
  }

  prepend(data) {
    const newNode = new DoublyListNode(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.size++;
    return this.toArrayWithLinks();
  }

  delete(data) {
    if (!this.head) return this.toArrayWithLinks();

    let current = this.head;
    while (current) {
      if (current.data === data) {
        if (current.prev) {
          current.prev.next = current.next;
        } else {
          this.head = current.next;
        }

        if (current.next) {
          current.next.prev = current.prev;
        } else {
          this.tail = current.prev;
        }

        this.size--;
        break;
      }
      current = current.next;
    }
    return this.toArrayWithLinks();
  }

  toArrayWithLinks() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push({
        data: current.data,
        hasNext: !!current.next,
        hasPrev: !!current.prev
      });
      current = current.next;
    }
    return result;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
    return this.toArrayWithLinks();
  }
}

// Create singly linked list
router.post('/singly/create/:id', (req, res) => {
  const { id } = req.params;
  const list = new SinglyLinkedList(id);
  linkedLists.set(`singly-${id}`, list);
  res.json({ success: true, list: list.toArray(), message: 'Singly linked list created' });
});

// Create doubly linked list
router.post('/doubly/create/:id', (req, res) => {
  const { id } = req.params;
  const list = new DoublyLinkedList(id);
  linkedLists.set(`doubly-${id}`, list);
  res.json({ success: true, list: list.toArrayWithLinks(), message: 'Doubly linked list created' });
});

// Singly linked list operations
router.get('/singly/:id', (req, res) => {
  const { id } = req.params;
  const list = linkedLists.get(`singly-${id}`);
  if (!list) {
    return res.status(404).json({ error: 'List not found' });
  }
  res.json({ list: list.toArray(), size: list.size });
});

router.post('/singly/:id/append', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const list = linkedLists.get(`singly-${id}`);
  
  if (!list) {
    return res.status(404).json({ error: 'List not found' });
  }

  const result = list.append(value);
  res.json({ success: true, list: result, message: `Appended ${value}` });
});

router.post('/singly/:id/prepend', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const list = linkedLists.get(`singly-${id}`);
  
  if (!list) {
    return res.status(404).json({ error: 'List not found' });
  }

  const result = list.prepend(value);
  res.json({ success: true, list: result, message: `Prepended ${value}` });
});

router.post('/singly/:id/delete', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const list = linkedLists.get(`singly-${id}`);
  
  if (!list) {
    return res.status(404).json({ error: 'List not found' });
  }

  const result = list.delete(value);
  res.json({ success: true, list: result, message: `Deleted ${value}` });
});

// Doubly linked list operations
router.get('/doubly/:id', (req, res) => {
  const { id } = req.params;
  const list = linkedLists.get(`doubly-${id}`);
  if (!list) {
    return res.status(404).json({ error: 'List not found' });
  }
  res.json({ list: list.toArrayWithLinks(), size: list.size });
});

router.post('/doubly/:id/append', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const list = linkedLists.get(`doubly-${id}`);
  
  if (!list) {
    return res.status(404).json({ error: 'List not found' });
  }

  const result = list.append(value);
  res.json({ success: true, list: result, message: `Appended ${value}` });
});

router.post('/doubly/:id/prepend', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const list = linkedLists.get(`doubly-${id}`);
  
  if (!list) {
    return res.status(404).json({ error: 'List not found' });
  }

  const result = list.prepend(value);
  res.json({ success: true, list: result, message: `Prepended ${value}` });
});

router.post('/doubly/:id/delete', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const list = linkedLists.get(`doubly-${id}`);
  
  if (!list) {
    return res.status(404).json({ error: 'List not found' });
  }

  const result = list.delete(value);
  res.json({ success: true, list: result, message: `Deleted ${value}` });
});

export { router as linkedListRoutes };