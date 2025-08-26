import React, { useState, useCallback, type DragEvent } from 'react';
import { downscaleImage } from '../lib/imageUtils';

interface ImageUploaderProps {
  onImageReady: (dataUrl: string) => void;
  previewUrl: string | null;
}

const MAX_FILE_SIZE_MB = 10;

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageReady, previewUrl }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = useCallback(async (file: File | null) => {
    if (!file) return;

    setError(null);
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setError('Invalid file type. Please use PNG or JPG.');
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large (> ${MAX_FILE_SIZE_MB}MB). Downscaling...`);
    }

    try {
      const dataUrl = await downscaleImage(file);
      onImageReady(dataUrl);
      setError(null);
    } catch (err) {
      setError('Failed to process image.');
      console.error(err);
    }
  }, [onImageReady]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0] || null);
  };
  
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    processFile(event.dataTransfer.files?.[0] || null);
  };

  const handleDragEvents = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setIsDragOver(true);
    } else if (event.type === "dragleave") {
      setIsDragOver(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-brand-muted mb-2">1. Upload Image</label>
      <div 
        onDrop={handleDrop}
        onDragEnter={handleDragEvents}
        onDragOver={handleDragEvents}
        onDragLeave={handleDragEvents}
        className={`mt-1 flex justify-center items-center p-6 border-2 border-dashed rounded-lg transition-colors duration-300
                    ${isDragOver ? 'border-brand-primary bg-brand-surface' : 'border-gray-600 hover:border-gray-500'}`}
      >
        <div className="space-y-1 text-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="mx-auto h-48 w-auto rounded-md" />
          ) : (
             <svg className="mx-auto h-12 w-12 text-brand-muted" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <div className="flex text-sm text-gray-400 justify-center">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-brand-dark rounded-md font-medium text-brand-primary hover:text-brand-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-brand-dark focus-within:ring-brand-primary">
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleFileChange} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};