import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import ImageUploader from '../common/ImageUploader';

const ProjectModal = ({ isOpen, onClose, project, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: '',
    technologies: '',
    featured: false
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        image: project.image || '',
        technologies: project.technologies?.join(', ') || '',
        featured: project.featured || false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        image: '',
        technologies: '',
        featured: false
      });
    }
  }, [project, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border border-white/10 sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {project ? 'Editează Proiect' : 'Adaugă Proiect Nou'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Image Upload */}
          <ImageUploader
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Imagine Proiect"
          />

          {/* Or URL Input */}
          <div>
            <Label className="text-gray-300">Sau URL Imagine</Label>
            <Input
              value={formData.image?.startsWith('data:') ? '' : formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
              className="bg-black/50 border-white/20 text-white mt-1"
            />
          </div>

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
            <Label className="text-gray-300">Descriere</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-black/50 border-white/20 text-white mt-1 min-h-24"
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">Categorie</Label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="ex: Electronics, Web Development"
              className="bg-black/50 border-white/20 text-white mt-1"
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">Tehnologii (separate prin virgulă)</Label>
            <Input
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React, Node.js, Arduino"
              className="bg-black/50 border-white/20 text-white mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-black/50 text-red-500 focus:ring-red-500"
            />
            <Label htmlFor="featured" className="text-gray-300 cursor-pointer">
              Proiect featured (afișat pe prima pagină)
            </Label>
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
              {project ? 'Salvează' : 'Adaugă'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
