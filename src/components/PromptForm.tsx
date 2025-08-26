import React from 'react';
import { Spinner } from './Spinner';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  style: string;
  setStyle: (style: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
  onAbort: () => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  prompt, setPrompt, style, setStyle, isLoading, onGenerate, onAbort
}) => {
  const isGenerateDisabled = !prompt || isLoading;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }} className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-brand-muted">2. Add Prompt</label>
        <div className="mt-1">
          <textarea
            id="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-brand-dark border-2 border-brand-surface rounded-lg p-3 outline-none 
                       focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
            placeholder="e.g., A cat wearing a spacesuit, cinematic lighting, 4k"
          />
        </div>
      </div>
      <div>
        <label htmlFor="style" className="block text-sm font-medium text-brand-muted">3. Select Style</label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full bg-brand-dark border-2 border-brand-surface rounded-lg p-3 mt-1 outline-none
                     focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition appearance-none"
        >
          <option>Editorial</option>
          <option>Streetwear</option>
          <option>Vintage</option>
          <option>Cyberpunk</option>
        </select>
      </div>
      <div className="flex items-center space-x-4">
        <button type="submit" disabled={isGenerateDisabled} className="px-6 py-2.5 font-semibold text-white bg-brand-primary rounded-lg shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-hover transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center">
          {isLoading ? <Spinner /> : 'Generate'}
        </button>
        {isLoading && (
          <button type="button" onClick={onAbort} className="px-6 py-2.5 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all">
            Abort
          </button>
        )}
      </div>
    </form>
  );
};