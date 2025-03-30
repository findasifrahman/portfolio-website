import initSqlJs from 'sql.js';

// Initialize SQLite database
let SQL;
let db;

export const initializeDatabase = async () => {
  try {
    SQL = await initSqlJs();
    db = new SQL.Database();
    
    // Create tables for storing chunks and embeddings
    db.run(`
      CREATE TABLE IF NOT EXISTS chunks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        source TEXT NOT NULL,
        metadata TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS embeddings (
        chunk_id INTEGER PRIMARY KEY,
        embedding TEXT NOT NULL,
        FOREIGN KEY (chunk_id) REFERENCES chunks(id)
      );
    `);

    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Process and chunk the scraped data
export const processData = (data) => {
  const chunks = [];
  
  // Process CV data
  if (data.cv?.raw_text) {
    const cvChunks = splitIntoChunks(data.cv.raw_text);
    cvChunks.forEach(chunk => {
      chunks.push({
        content: chunk,
        source: 'cv',
        metadata: JSON.stringify({ type: 'cv' })
      });
    });
  }

  // Process GitHub data
  if (data.github?.repositories) {
    data.github.repositories.forEach(repo => {
      chunks.push({
        content: `Repository: ${repo.name}\nDescription: ${repo.description || 'No description'}\nLanguages: ${Object.keys(repo.languages).join(', ')}`,
        source: 'github',
        metadata: JSON.stringify({ type: 'github', repo: repo.name })
      });
    });
  }

  // Process company data
  if (data.company) {
    chunks.push({
      content: `Company: ${data.company.title}\nDescription: ${data.company.description}`,
      source: 'company',
      metadata: JSON.stringify({ type: 'company' })
    });
  }

  // Process YouTube data
  if (data.youtube?.videos) {
    data.youtube.videos.forEach(video => {
      chunks.push({
        content: `Video: ${video.title}\nDescription: ${video.description}`,
        source: 'youtube',
        metadata: JSON.stringify({ type: 'youtube', videoId: video.url })
      });
    });
  }

  return chunks;
};

// Split text into chunks
const splitIntoChunks = (text, chunkSize = 1000) => {
  const chunks = [];
  let currentChunk = '';
  
  text.split('\n').forEach(line => {
    if ((currentChunk + line).length > chunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = line;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + line;
    }
  });
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
};

// Store chunks in database
export const storeChunks = (chunks) => {
  const stmt = db.prepare(`
    INSERT INTO chunks (content, source, metadata)
    VALUES (?, ?, ?)
  `);

  chunks.forEach(chunk => {
    stmt.run([chunk.content, chunk.source, chunk.metadata]);
  });
  stmt.free();
};

// Get relevant chunks for a query
export const getRelevantChunks = (query, limit = 5) => {
  // For now, we'll use a simple text-based search
  // In a real implementation, you would use embeddings and similarity search
  const stmt = db.prepare(`
    SELECT content, source, metadata
    FROM chunks
    WHERE content LIKE ?
    LIMIT ?
  `);

  const results = stmt.getAsObject([`%${query}%`, limit]);
  stmt.free();
  
  return results;
};

// Save database to file
export const saveDatabase = () => {
  const data = db.export();
  const buffer = new Uint8Array(data);
  const blob = new Blob([buffer], { type: 'application/x-sqlite3' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chatbot.db';
  a.click();
  
  URL.revokeObjectURL(url);
};

// Load database from file
export const loadDatabase = async (file) => {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  db = new SQL.Database(data);
}; 