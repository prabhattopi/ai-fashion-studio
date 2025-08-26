import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface LivePreviewCardProps {
  imageUrl: string | null;
  prompt: string;
  style: string;
}

export const LivePreviewCard: React.FC<LivePreviewCardProps> = ({ imageUrl, prompt, style }) => {
  return (
    <div className="bg-brand-surface p-4 rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Live Preview</h2>
      <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-brand-dark">
        {imageUrl ? (
          <img src={imageUrl} alt="Live preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-brand-dark flex flex-col items-center justify-center text-center p-4">
            <ImageIcon className="w-16 h-16 text-brand-muted/50" />
            <p className="text-brand-muted mt-2">Upload an image to begin</p>
          </div>
        )}
        {(imageUrl && (prompt || style)) && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <span className="text-xs font-bold uppercase bg-brand-primary/90 px-2 py-1 rounded">
                {style}
              </span>
              <p className="mt-1 font-semibold leading-tight">{prompt || 'Your prompt will appear here...'}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};