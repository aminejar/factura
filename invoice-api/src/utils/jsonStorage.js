import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple file locking mechanism
const locks = new Map();

function acquireLock(filePath, timeout = 5000) {
  const lockKey = filePath;
  const startTime = Date.now();

  while (locks.has(lockKey)) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Timeout acquiring lock for ${filePath}`);
    }
    // Busy wait - in production, consider using a proper locking mechanism
  }

  locks.set(lockKey, true);
  return () => locks.delete(lockKey);
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Helper functions for JSON file storage
export class JsonStorage {
  constructor(filename) {
    this.filePath = path.join(__dirname, '../data', filename);
    this.ensureFileExists();
  }

  ensureFileExists() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]', 'utf8');
    }
  }

  readData() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  writeData(data) {
    try {
      // Ensure data is an array
      const dataToWrite = Array.isArray(data) ? data : [];
      // Atomic write using temporary file
      const tempFile = `${this.filePath}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(dataToWrite, null, 2), 'utf8');
      fs.renameSync(tempFile, this.filePath);
      return true;
    } catch (error) {
      console.error(`Error writing ${this.filePath}:`, error);
      return false;
    }
  }

  findById(id) {
    if (!id) return null;
    const releaseLock = acquireLock(this.filePath);
    try {
      const data = this.readData();
      // Normalize ID comparison to handle both string and number types
      const normalizedId = String(id);
      return data.find(item => String(item.id) === normalizedId) || null;
    } finally {
      releaseLock();
    }
  }

  findOne(query) {
    if (!query || typeof query !== 'object') return null;
    const releaseLock = acquireLock(this.filePath);
    try {
      const data = this.readData();
      return data.find(item => {
        return Object.keys(query).every(key => {
          // Normalize comparison to handle both string and number types
          return String(item[key]) === String(query[key]);
        });
      }) || null;
    } finally {
      releaseLock();
    }
  }

  find(query = {}) {
    if (!query || typeof query !== 'object') return [];
    const releaseLock = acquireLock(this.filePath);
    try {
      const data = this.readData();
      return data.filter(item => {
        return Object.keys(query).every(key => {
          // Normalize comparison to handle both string and number types
          return String(item[key]) === String(query[key]);
        });
      });
    } finally {
      releaseLock();
    }
  }

  create(item) {
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid item data');
    }

    const releaseLock = acquireLock(this.filePath);
    try {
      const data = this.readData();
      const newItem = {
        ...item,
        id: generateId(),
        createdAt: new Date().toISOString()
      };
      data.push(newItem);
      if (!this.writeData(data)) {
        throw new Error('Failed to write data');
      }
      return newItem;
    } finally {
      releaseLock();
    }
  }

  update(id, updates) {
    if (!id || !updates || typeof updates !== 'object') {
      return null;
    }

    const releaseLock = acquireLock(this.filePath);
    try {
      const data = this.readData();
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return null;

      data[index] = {
        ...data[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      if (!this.writeData(data)) {
        throw new Error('Failed to write data');
      }
      return data[index];
    } finally {
      releaseLock();
    }
  }

  delete(id) {
    if (!id) return false;

    const releaseLock = acquireLock(this.filePath);
    try {
      const data = this.readData();
      const initialLength = data.length;
      const filteredData = data.filter(item => item.id !== id);

      if (filteredData.length === initialLength) return false;

      if (!this.writeData(filteredData)) {
        throw new Error('Failed to write data');
      }
      return true;
    } finally {
      releaseLock();
    }
  }

  getAll() {
    const releaseLock = acquireLock(this.filePath);
    try {
      return this.readData();
    } finally {
      releaseLock();
    }
  }

  count() {
    const releaseLock = acquireLock(this.filePath);
    try {
      return this.readData().length;
    } finally {
      releaseLock();
    }
  }
}

// Create storage instances
export const usersStorage = new JsonStorage('users.json');
export const clientsStorage = new JsonStorage('clients.json');
export const productsStorage = new JsonStorage('products.json');
export const invoicesStorage = new JsonStorage('invoices.json');
export const paymentsStorage = new JsonStorage('payments.json');
