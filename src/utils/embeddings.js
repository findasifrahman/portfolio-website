import { generateEmbedding as generateEmbeddingFromModel } from './modelLoader';

let db = null;

export const initializeDatabase = async () => {
  if (!db) {
    // Create IndexedDB database
    const request = indexedDB.open('chatbotDB', 1);
    
    await new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db = request.result;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('chunks')) {
          db.createObjectStore('chunks', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }
  return db;
};

export const processAndStoreData = async (db, data) => {
  try {
    console.log('Processing data:', Object.keys(data));
    
    // Process local PDFs data if available
    if (data.local_pdfs) {
      console.log('Processing local PDFs data');
      for (const pdf of data.local_pdfs) {
        if (pdf.raw_text) {
          const chunks = splitIntoChunks(pdf.raw_text);
          console.log(`Generated ${chunks.length} chunks from ${pdf.filename}`);
          
          for (const chunk of chunks) {
            const embedding = await generateEmbeddingFromModel(chunk);
            await storeChunk(db, {
              text: chunk,
              embedding,
              source: `pdf_${pdf.filename}`,
              metadata: {
                filename: pdf.filename,
                type: 'pdf'
              }
            });
          }
        }
      }
    }

    // Process other data fields
    const fieldsToProcess = [
      'about',
      'skills',
      'experience',
      'education',
      'projects',
      'certifications',
      'contact'
    ];

    for (const field of fieldsToProcess) {
      if (data[field]) {
        console.log(`Processing ${field} data`);
        const chunks = splitIntoChunks(data[field]);
        console.log(`Generated ${chunks.length} chunks from ${field}`);
        
        for (const chunk of chunks) {
          const embedding = await generateEmbeddingFromModel(chunk);
          await storeChunk(db, {
            text: chunk,
            embedding,
            source: field,
            metadata: {
              field,
              type: 'portfolio'
            }
          });
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error processing data:', error);
    return false;
  }
};

export const findSimilarChunks = async (db, query) => {
  try {
    const queryEmbedding = await generateEmbeddingFromModel(query);
    const chunks = await getAllChunks(db);
    
    // Calculate similarity scores
    const scoredChunks = chunks.map(chunk => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    // Sort by similarity score and get top results
    const similarChunks = scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Increased from 3 to 5 for better context

    console.log(`Found ${similarChunks.length} similar chunks with scores:`, 
      similarChunks.map(c => c.score.toFixed(3)));

    return similarChunks;
  } catch (error) {
    console.error('Error finding similar chunks:', error);
    return [];
  }
};

export const splitIntoChunks = (text) => {
  if (!text || typeof text !== 'string') {
    console.warn('Invalid text input for chunking');
    return [];
  }

  // Clean up the text
  text = text.replace(/\s+/g, ' ').trim();
  
  // Split into paragraphs first (preserve structure)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
  const chunks = [];
  
  for (const paragraph of paragraphs) {
    // Split paragraph into sentences
    const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
    let currentChunk = [];
    let currentLength = 0;
    const maxChunkLength = 500;

    for (const sentence of sentences) {
      const sentenceLength = sentence.length;
      
      // Check if this is a special section (like skills list)
      const isSpecialSection = /^(skills|expertise|technologies|tools|languages|frameworks|databases|platforms)/i.test(sentence);
      
      // If it's a special section, start a new chunk
      if (isSpecialSection && currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
        currentChunk = [];
        currentLength = 0;
      }
      
      // If adding this sentence would exceed max length, start a new chunk
      if (currentLength + sentenceLength > maxChunkLength && currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
        currentChunk = [];
        currentLength = 0;
      }
      
      currentChunk.push(sentence);
      currentLength += sentenceLength;
    }

    // Add the last chunk if it exists
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }
  }

  // Post-process chunks to ensure they're meaningful
  return chunks
    .map(chunk => {
      // Clean up the chunk
      chunk = chunk.trim();
      
      // Remove any bullet points or numbering at the start
      chunk = chunk.replace(/^[\d\s•\-\*]+/, '');
      
      // Normalize spaces
      chunk = chunk.replace(/\s+/g, ' ');
      
      return chunk;
    })
    .filter(chunk => {
      // Filter out very short chunks
      if (chunk.length < 50) return false;
      
      // Filter out chunks that are just numbers or special characters
      if (/^[\d\s\-\*]+$/.test(chunk)) return false;
      
      // Filter out chunks that are just repeated characters
      if (/(.)\1{10,}/.test(chunk)) return false;
      
      return true;
    });
};

export const storeChunk = async (db, chunk) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['chunks'], 'readwrite');
    const store = transaction.objectStore('chunks');
    
    const request = store.add(chunk);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAllChunks = async (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['chunks'], 'readonly');
    const store = transaction.objectStore('chunks');
    
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) {
    return 0;
  }

  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
} 