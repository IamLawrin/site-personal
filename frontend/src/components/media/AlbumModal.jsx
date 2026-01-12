import React, { useState, useEffect } from 'react';
import { FolderPlus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import ImageUploader from '../common/ImageUploader';

const AlbumModal = ({ isOpen, onClose, album, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cover: ''
  });

  useEffect(() => {
    if (album) {
      setFormData({
        name: album.name || '',
        description: album.description || '',
        cover: album.cover || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        cover: ''
      });
    }
  }, [album, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  const handleDelete = () => {
    if (album) {
      onDelete(album.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-red-500" />
            {album ? 'Editează Album' : 'Album Nou'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Cover Image Upload */}
          <ImageUploader
            value={formData.cover}
            onChange={(url) => setFormData({ ...formData, cover: url })}
            label="Imagine Copertă"
          />

          <div>
            <Label className="text-gray-300">Nume Album</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ex: Proiecte Arduino"
              className="bg-black/50 border-white/20 text-white mt-1"
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">Descriere</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Scurtă descriere a albumului"
              className="bg-black/50 border-white/20 text-white mt-1 min-h-20"
            />
          </div>

          <div className="flex gap-3 pt-4">
            {album && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="px-4"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
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
              disabled={!formData.name.trim()}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {album ? 'Salvează' : 'Creează'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AlbumModal;
