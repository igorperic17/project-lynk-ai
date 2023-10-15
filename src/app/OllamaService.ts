interface EmbeddingsResponse {
  embedding: number[];
}

interface GenerateEmbeddingsParams {
  model: string;
  prompt: string;
  options?: Record<string, any>;
}

class OllamaService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `http://${process.env.BASE_URL_OLLAMA}/api`; // Ollama server base URL
  }

  /**
   * Generate embeddings for a given input string using Ollama.
   * @param params - Parameters for generating embeddings.
   * @returns A promise that resolves to the embeddings.
   */
  async generateEmbeddings(params: GenerateEmbeddingsParams): Promise<number[]> {
    // console.log(`${this.baseUrl}/embeddings`);
    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: EmbeddingsResponse = await response.json();
      return data.embedding;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw error;
    }
  }
}

export default OllamaService;
