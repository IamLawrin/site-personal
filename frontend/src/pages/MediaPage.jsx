import React, { useState } from 'react';
import { Plus, Grid, List, Image as ImageIcon, Upload, X, Trash2, Edit2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockGalleryImages } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import MediaModal from '../components/media/MediaModal';
import ImageViewerModal from '../components/media/ImageViewerModal';

const MediaPage = () => {
  const { isAdmin } = useAuth();
  const [images, setImages] = useState(mockGalleryImages);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [viewerImage, setViewerImage] = useState(null);

  // Get unique categories
  const categories = ['all', ...new Set(images.map(img => img.category))];

  // Filter images
  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  const handleAddImage = () => {
    setEditingImage(null);
    setModalOpen(true);
  };

  const handleEditImage = (image, e) => {
    e.stopPropagation();
    setEditingImage(image);
    setModalOpen(true);
  };

  const handleDeleteImage = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Ești sigur că vrei să ștergi această imagine?')) {
      setImages(images.filter(img => img.id !== id));
    }
  };

  const handleSaveImage = (imageData) => {
    if (editingImage) {
      setImages(images.map(img =>
        img.id === editingImage.id ? { ...img, ...imageData } : img
      ));
    } else {
      const newImage = {
        ...imageData,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      };
      setImages([newImage, ...images]);
    }
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <span className="text-red-500 text-sm font-mono uppercase tracking-wider">Galerie</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Media
          </h1>
          <p className="text-gray-400 max-w-2xl">
            O colecție de imagini din proiectele mele, workshop și alte momente.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-red-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {category === 'all' ? 'Toate' : category}
              </button>
            ))}
          </div>

          {/* View Mode & Add Button */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {isAdmin && (
              <Button
                onClick={handleAddImage}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adaugă Imagine
              </Button>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isAdmin && (
              <button
                onClick={handleAddImage}
                className="aspect-square bg-zinc-900/50 rounded-xl border-2 border-dashed border-white/20 hover:border-red-500/50 transition-all flex flex-col items-center justify-center gap-3"
              >
                <Upload className="w-8 h-8 text-gray-500" />
                <span className="text-gray-500 text-sm">Adaugă imagine</span>
              </button>
            )}
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setViewerImage(image)}
                className="group relative aspect-square bg-zinc-900 rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white font-medium text-sm truncate">{image.title}</p>
                  <p className="text-gray-400 text-xs">{image.category}</p>
                </div>

                {/* Admin actions */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditImage(image, e)}
                      className="p-2 bg-white/90 rounded-lg hover:bg-white text-black"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteImage(image.id, e)}
                      className="p-2 bg-red-500 rounded-lg hover:bg-red-600 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setViewerImage(image)}
                className="group flex items-center gap-4 bg-zinc-900 rounded-xl p-3 border border-white/10 hover:border-red-500/30 cursor-pointer transition-all"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{image.title}</p>
                  <p className="text-gray-500 text-sm">{image.category}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    {new Date(image.date).toLocaleDateString('ro-RO')}
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleEditImage(image, e)}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteImage(image.id, e)}
                      className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">Nu există imagini în această categorie.</p>
          </div>
        )}
      </div>

      {/* Media Modal */}
      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        image={editingImage}
        onSave={handleSaveImage}
      />

      {/* Image Viewer */}
      <ImageViewerModal
        isOpen={!!viewerImage}
        onClose={() => setViewerImage(null)}
        image={viewerImage}
      />
    </div>
  );
};

export default MediaPage;
