import axios, { AxiosResponse } from 'axios';

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
    this.baseUrl = 'http://127.0.0.1:11434/api'; // Ollama server base URL
  }

  /**
   * Generate embeddings for a given input string using Ollama.
   * @param params - Parameters for generating embeddings.
   * @returns A promise that resolves to the embeddings.
   */
  async generateEmbeddings(params: GenerateEmbeddingsParams): Promise<number[]> {
    try {
      // console.log(`${this.baseUrl}/embeddings`);
      // console.log(JSON.stringify(params));
      const response: AxiosResponse<EmbeddingsResponse> = await axios.post(
        `${this.baseUrl}/embeddings`,
        JSON.stringify(params)
      );
      // console.log(response);
      return response.data.embedding;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw error;
    }
  }
}

export default OllamaService;
