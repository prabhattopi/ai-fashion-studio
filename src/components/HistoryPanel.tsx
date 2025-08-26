import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import type { GenerationResponse } from '../lib/api';

interface HistoryPanelProps {
  history: GenerationResponse[];
  onSelect: (item: GenerationResponse) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
  return (
    <div className="bg-brand-surface p-4 rounded-lg h-full">
      <h2 className="text-xl font-bold mb-4">History</h2>
      {history.length === 0 ? (
        <p className="text-brand-muted">Your last 5 generations will appear here.</p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence>
            {history.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <button onClick={() => onSelect(item)} className="w-full text-left p-3 rounded-lg bg-brand-dark hover:bg-opacity-80 transition-colors flex items-center space-x-4">
                  <img src={item.imageUrl} alt={item.prompt} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-semibold truncate text-white">{item.prompt}</p>
                    <p className="text-sm text-brand-muted">{item.style}</p>
                    <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</p>
                  </div>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};