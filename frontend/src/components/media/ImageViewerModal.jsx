import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';

const ImageViewerModal = ({ isOpen, onClose, image }) => {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 border-none sm:max-w-4xl p-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="relative">
          <img
            src={image.url}
            alt={image.title}
            className="w-full max-h-[80vh] object-contain"
          />
        </div>
        
        <div className="p-4 bg-zinc-900">
          <h3 className="text-white font-medium">{image.title}</h3>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-gray-500 text-sm">{image.category}</span>
            <span className="text-gray-600 text-sm">
              {new Date(image.date).toLocaleDateString('ro-RO')}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewerModal;
