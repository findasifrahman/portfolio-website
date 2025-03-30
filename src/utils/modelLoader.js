import { pipeline, env } from '@xenova/transformers';

// Configure the environment
env.allowLocalModels = false;
env.useBrowserCache = true;
env.backendName = 'webgl';

let model = null;

export const initializeModel = async () => {
  if (!model) {
    try {
      console.log('Initializing embedding model...');
      model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        progress_callback: (progress) => {
          if (progress.progress) {
            console.log(`Loading model: ${Math.round(progress.progress * 100)}%`);
          }
        },
        cache_dir: 'models',
        local_files_only: false,
        revision: 'main',
        quantized: true
      });
      console.log('Embedding model initialized successfully');
    } catch (error) {
      console.error('Error initializing model:', error);
      throw error;
    }
  }
  return model;
};

export const generateEmbedding = async (text) => {
  try {
    if (!model) {
      await initializeModel();
    }
    
    if (!text || typeof text !== 'string') {
      console.warn('Invalid text provided for embedding:', text);
      return null;
    }

    const output = await model(text, { 
      pooling: 'mean', 
      normalize: true 
    });
    
    return Array.from(output.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}; 