import { useState, useCallback, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ImageUploader } from './components/ImageUploader';
import { PromptForm } from './components/PromptForm';
import { HistoryPanel } from './components/HistoryPanel';
import { LivePreviewCard } from './components/LivePreviewCard';
import ErrorBoundary from './components/ErrorBoundary';
import { mockApi, type GenerationRequest, type GenerationResponse } from './lib/api';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 500;

function App() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Editorial');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<GenerationResponse[]>(() => {
    const saved = localStorage.getItem('aiStudioHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    localStorage.setItem('aiStudioHistory', JSON.stringify(history));
  }, [history]);

  const handleHistorySelect = (item: GenerationResponse) => {
    toast.success("Loaded from history!");
    setImageDataUrl(item.imageUrl);
    setPrompt(item.prompt);
    setStyle(item.style);
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      toast.error('Generation aborted!');
      setIsLoading(false);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!imageDataUrl) {
      toast.error('Please upload an image first.');
      return;
    }
    if (!prompt) {
      toast.error('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    const generationRequest: GenerationRequest = { imageDataUrl, prompt, style };

    const generationPromise = new Promise<GenerationResponse>(async (resolve, reject) => {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'));
          
          // Show retry toast on subsequent attempts
          if(attempt > 1) {
            toast.loading(`Model overloaded. Retrying... (${attempt}/${MAX_RETRIES})`, { id: 'generation-toast' });
          }

          const result = await mockApi.generate(generationRequest, signal);
          return resolve(result);
        } catch (err: any) {
          if (err.name === 'AbortError') return reject(err);
          if (attempt === MAX_RETRIES) return reject(err);
          
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
          await new Promise(res => setTimeout(res, delay));
        }
      }
    });

    toast.promise(
      generationPromise,
      {
        loading: 'AI is thinking...',
        success: (result) => {
          setHistory(prev => [result, ...prev].slice(0, 5));
          return 'Generation complete!';
        },
        error: 'Generation failed. Please try again.',
      },
      { id: 'generation-toast' }
    );
    
    try {
      await generationPromise;
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageDataUrl, prompt, style]);

  return (
    <>
      <Toaster position="bottom-center" toastOptions={{
        style: { background: '#1F2937', color: '#FFFFFF', border: '1px solid #4B5563' },
      }}/>
      <div className="bg-brand-dark text-white min-h-screen font-sans">
        <div className="container mx-auto p-4 md:p-8">
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-primary">AI Studio</h1>
            <p className="text-brand-muted mt-2">Create stunning visuals with the power of AI</p>
          </header>
          <ErrorBoundary>
            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-8">
                <ImageUploader onImageReady={setImageDataUrl} previewUrl={imageDataUrl} />
                <PromptForm
                  prompt={prompt} setPrompt={setPrompt}
                  style={style} setStyle={setStyle}
                  isLoading={isLoading}
                  onGenerate={handleGenerate} onAbort={handleAbort}
                />
                <HistoryPanel history={history} onSelect={handleHistorySelect} />
              </div>
              <aside className="lg:col-span-2 lg:sticky top-8 self-start">
                <LivePreviewCard imageUrl={imageDataUrl} prompt={prompt} style={style} />
              </aside>
            </main>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}

export default App;