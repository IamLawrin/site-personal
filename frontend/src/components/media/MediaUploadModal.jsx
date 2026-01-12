import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const MediaUploadModal = ({ isOpen, onClose, onSave, albums, defaultAlbum }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    albumId: defaultAlbum || '',
    url: ''
  });
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Reset form when modal opens with default album
  React.useEffect(() => {
    if (isOpen && defaultAlbum) {
      setFormData(prev => ({ ...prev, albumId: defaultAlbum }));
    }
  }, [isOpen, defaultAlbum]);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        // For mock, use the data URL as the image URL
        // In production, this would upload to server and get back a URL
        setFormData(prev => ({ ...prev, url: e.target.result }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
      
      // Auto-fill title from filename
      if (!formData.title) {
        const name = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setFormData(prev => ({ ...prev, title: name }));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.url) return;
    
    const selectedAlbum = albums.find(a => a.id === formData.albumId);
    onSave({
      ...formData,
      category: selectedAlbum?.name || formData.category || 'Uncategorized'
    });
    
    // Reset form
    setFormData({ title: '', category: '', albumId: defaultAlbum || '', url: '' });
    setPreview(null);
  };

  const handleClose = () => {
    setFormData({ title: '', category: '', albumId: defaultAlbum || '', url: '' });
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-900 border border-white/10 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-red-500" />
            Upload Imagine
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-red-500 bg-red-500/10' 
                : 'border-white/20 hover:border-white/40 bg-black/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              className="hidden"
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-3" />
                <p className="text-gray-400">Se încarcă...</p>
              </div>
            ) : preview ? (
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-48 mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setFormData(prev => ({ ...prev, url: '' })); }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="w-10 h-10 text-gray-500 mb-3" />
                <p className="text-gray-400 mb-1">Trage imaginea aici sau click pentru a selecta</p>
                <p className="text-gray-600 text-sm">PNG, JPG, WebP până la 10MB</p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <Label className="text-gray-300">Titlu</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Numele imaginii"
              className="bg-black/50 border-white/20 text-white mt-1"
              required
            />
          </div>

          {/* Album Select */}
          <div>
            <Label className="text-gray-300">Album</Label>
            <Select 
              value={formData.albumId} 
              onValueChange={(value) => setFormData({ ...formData, albumId: value })}
            >
              <SelectTrigger className="bg-black/50 border-white/20 text-white mt-1">
                <SelectValue placeholder="Selectează albumul" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10">
                {albums.map((album) => (
                  <SelectItem 
                    key={album.id} 
                    value={album.id}
                    className="text-white hover:bg-white/10"
                  >
                    {album.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="flex-1 text-gray-400 hover:text-white"
            >
              Anulează
            </Button>
            <Button
              type="submit"
              disabled={!formData.url || !formData.title}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
            >
              Salvează
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadModal;
