import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

const MediaModal = ({ isOpen, onClose, image, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: ''
  });

  useEffect(() => {
    if (image) {
      setFormData({
        title: image.title || '',
        url: image.url || '',
        category: image.category || ''
      });
    } else {
      setFormData({
        title: '',
        url: '',
        category: ''
      });
    }
  }, [image, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border border-white/10 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">
            {image ? 'Editează Imagine' : 'Adaugă Imagine Nouă'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label className="text-gray-300">Titlu</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-black/50 border-white/20 text-white mt-1"
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">URL Imagine</Label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              className="bg-black/50 border-white/20 text-white mt-1"
              required
            />
            {formData.url && (
              <img
                src={formData.url}
                alt="Preview"
                className="mt-2 w-full h-32 object-cover rounded-lg border border-white/10"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
          </div>

          <div>
            <Label className="text-gray-300">Categorie</Label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="ex: Electronics, Workspace, Projects"
              className="bg-black/50 border-white/20 text-white mt-1"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 text-gray-400 hover:text-white"
            >
              Anulează
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {image ? 'Salvează' : 'Adaugă'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MediaModal;
