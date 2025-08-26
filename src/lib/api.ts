export interface GenerationRequest {
    imageDataUrl: string;
    prompt: string;
    style: string;
  }
  
  export interface GenerationResponse {
    id: string;
    imageUrl: string;
    prompt: string;
    style: string;
    createdAt: string;
  }
  
  let activeRequestTimeoutId: number | null = null;
  
  export const mockApi = {
    generate: (
      data: GenerationRequest,
      signal: AbortSignal
    ): Promise<GenerationResponse> => {
      return new Promise((resolve, reject) => {
        const handleAbort = () => {
          if (activeRequestTimeoutId) {
            clearTimeout(activeRequestTimeoutId);
          }
          reject(new DOMException('Aborted', 'AbortError'));
        };
  
        signal.addEventListener('abort', handleAbort);
  
        activeRequestTimeoutId = window.setTimeout(() => {
          signal.removeEventListener('abort', handleAbort);
  
          if (signal.aborted) {
            return;
          }
  
          if (Math.random() < 0.2) { // 20% failure rate
            reject({ message: "Model overloaded" });
          } else {
            const response: GenerationResponse = {
              id: crypto.randomUUID(),
              imageUrl: data.imageDataUrl,
              prompt: data.prompt,
              style: data.style,
              createdAt: new Date().toISOString(),
            };
            resolve(response);
          }
        }, 1000 + Math.random() * 1000); // 1-2 second delay
      });
    },
  };