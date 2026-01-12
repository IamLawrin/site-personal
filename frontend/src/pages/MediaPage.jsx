import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, Trash2, Upload, ChevronLeft, ChevronRight, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import MediaUploadModal from '../components/media/MediaUploadModal';
import AlbumModal from '../components/media/AlbumModal';
import { mockGalleryImages } from '../data/mockData';

const MediaPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeAlbumId = searchParams.get('album');
  
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editingAlbum, setEditingAlbum] = useState(null);
  
  // Albums with cover images
  const [albums, setAlbums] = useState([
    { 
      id: 'electronics', 
      name: 'Electronică', 
      description: 'Proiecte și componente electronice',
      cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop'
    },
    { 
      id: 'workspace', 
      name: 'Workspace', 
      description: 'Laboratorul meu de lucru',
      cover: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop'
    },
    { 
      id: 'projects', 
      name: 'Proiecte', 
      description: 'Proiecte finalizate',
      cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    },
  ]);

  const [images, setImages] = useState(mockGalleryImages.map(img => ({
    ...img,
    albumId: img.category.toLowerCase() === 'electronics' ? 'electronics' : 
             img.category.toLowerCase() === 'workspace' ? 'workspace' : 'projects'
  })));

  // Get images for active album
  const albumImages = activeAlbumId 
    ? images.filter(img => img.albumId === activeAlbumId)
    : [];

  // Get active album details
  const activeAlbum = albums.find(a => a.id === activeAlbumId);

  // Featured images for slideshow (from all albums)
  const featuredImages = images.slice(0, 5);

  // Update album counts
  const getAlbumCount = (albumId) => images.filter(img => img.albumId === albumId).length;

  // Auto-advance slideshow
  useEffect(() => {
    if (!activeAlbumId && featuredImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % featuredImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredImages.length, activeAlbumId]);

  const handleAddImage = (imageData) => {
    const newImage = {
      ...imageData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setImages(prev => [newImage, ...prev]);
    setUploadModalOpen(false);
  };

  const handleDeleteImage = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Ștergi această imagine?')) {
      setImages(prev => prev.filter(img => img.id !== id));
    }
  };

  const handleSaveAlbum = (albumData) => {
    if (editingAlbum) {
      setAlbums(prev => prev.map(a => a.id === editingAlbum.id ? { ...a, ...albumData } : a));
    } else {
      const newAlbum = {
        ...albumData,
        id: albumData.name.toLowerCase().replace(/\s+/g, '-'),
        cover: albumData.cover || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop'
      };
      setAlbums(prev => [...prev, newAlbum]);
    }
    setAlbumModalOpen(false);
    setEditingAlbum(null);
  };

  const handleDeleteAlbum = (albumId) => {
    if (window.confirm('Ștergi acest album? Imaginile vor fi șterse.')) {
      setImages(prev => prev.filter(img => img.albumId !== albumId));
      setAlbums(prev => prev.filter(a => a.id !== albumId));
      setSearchParams({});
    }
  };

  const openAlbum = (albumId) => {
    setSearchParams({ album: albumId });
  };

  const closeAlbum = () => {
    setSearchParams({});
  };

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % featuredImages.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + featuredImages.length) % featuredImages.length);

  // Navigate through images in full-screen viewer
  const nextImage = (e) => {
    e.stopPropagation();
    const currentIndex = albumImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % albumImages.length;
    setSelectedImage(albumImages[nextIndex]);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const currentIndex = albumImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + albumImages.length) % albumImages.length;
    setSelectedImage(albumImages[prevIndex]);
  };

  // ALBUM VIEW - When an album is selected
  if (activeAlbumId && activeAlbum) {
    return (
      <div className="min-h-screen bg-black pt-20">
        {/* Album Header */}
        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-[1600px] mx-auto">
            <button
              onClick={closeAlbum}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Înapoi la albume</span>
            </button>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {activeAlbum.name}
                </h1>
                <p className="text-gray-400">{activeAlbum.description}</p>
                <p className="text-gray-500 text-sm mt-1">{albumImages.length} imagini</p>
              </div>

              {isAdmin && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setUploadModalOpen(true)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <Button
                    onClick={() => { setEditingAlbum(activeAlbum); setAlbumModalOpen(true); }}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 rounded-full"
                  >
                    Editează Album
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Album Images Grid */}
        <div className="px-4 sm:px-6 pb-16">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {albumImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-[4/3] bg-zinc-900 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                  
                  {/* Hover info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-medium">{image.title}</p>
                  </div>

                  {/* Admin delete button */}
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDeleteImage(image.id, e)}
                      className="absolute top-3 right-3 p-2 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {albumImages.length === 0 && (
              <div className="text-center py-20">
                <ImageIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">Nu există imagini în acest album.</p>
                {isAdmin && (
                  <Button
                    onClick={() => setUploadModalOpen(true)}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  >
                    Adaugă prima imagine
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Full-screen Image Viewer */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {albumImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-6 left-6 text-white">
              <p className="font-medium text-lg">{selectedImage.title}</p>
            </div>
          </div>
        )}

        {/* Modals */}
        <MediaUploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onSave={handleAddImage}
          albums={albums}
          defaultAlbum={activeAlbumId}
        />

        <AlbumModal
          isOpen={albumModalOpen}
          onClose={() => { setAlbumModalOpen(false); setEditingAlbum(null); }}
          album={editingAlbum}
          onSave={handleSaveAlbum}
          onDelete={handleDeleteAlbum}
        />
      </div>
    );
  }

  // MAIN MEDIA PAGE - Albums view
  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Section with Quote */}
      <section className="py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-xl md:text-3xl font-light text-white leading-relaxed mb-4">
            "Fiecare imagine spune o poveste. Aici sunt poveștile mele."
          </blockquote>
          <p className="text-gray-400 text-base md:text-lg">
            O colecție de momente capturate din proiectele mele de electronică, 
            workshop și călătoria mea ca student și creator.
          </p>
        </div>
      </section>

      {/* Featured Slideshow */}
      {featuredImages.length > 0 && (
        <section className="mb-12 md:mb-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative aspect-[16/8] rounded-xl overflow-hidden bg-zinc-900">
              {featuredImages.map((img, index) => (
                <div
                  key={img.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-medium">{img.title}</p>
                    <p className="text-gray-300 text-sm">{img.category}</p>
                  </div>
                </div>
              ))}

              {/* Slideshow Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 right-4 flex gap-1.5">
                {featuredImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Albums Section */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-white">Albume</h2>
            </div>

            {isAdmin && (
              <Button
                onClick={() => { setEditingAlbum(null); setAlbumModalOpen(true); }}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Album nou
              </Button>
            )}
          </div>

          {/* Albums Grid - With cover images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {albums.map((album) => (
              <div
                key={album.id}
                onClick={() => openAlbum(album.id)}
                className="group relative aspect-[4/3] bg-zinc-900 overflow-hidden cursor-pointer"
              >
                <img
                  src={album.cover}
                  alt={album.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Album Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-semibold text-xl mb-1 group-hover:text-red-400 transition-colors">
                    {album.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">{album.description}</p>
                  <p className="text-gray-500 text-xs">{getAlbumCount(album.id)} imagini</p>
                </div>

                {/* Admin edit button */}
                {isAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingAlbum(album); setAlbumModalOpen(true); }}
                    className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <Plus className="w-4 h-4 rotate-45" />
                  </button>
                )}
              </div>
            ))}

            {/* Add Album Card - Admin only */}
            {isAdmin && (
              <div
                onClick={() => { setEditingAlbum(null); setAlbumModalOpen(true); }}
                className="group aspect-[4/3] bg-zinc-900/50 border-2 border-dashed border-white/20 hover:border-red-500/50 flex flex-col items-center justify-center cursor-pointer transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mb-3 group-hover:bg-red-500/30 transition-colors">
                  <Plus className="w-7 h-7 text-red-500" />
                </div>
                <p className="text-gray-400 group-hover:text-white transition-colors">Creează album nou</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modals */}
      <MediaUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSave={handleAddImage}
        albums={albums}
      />

      <AlbumModal
        isOpen={albumModalOpen}
        onClose={() => { setAlbumModalOpen(false); setEditingAlbum(null); }}
        album={editingAlbum}
        onSave={handleSaveAlbum}
        onDelete={handleDeleteAlbum}
      />
    </div>
  );
};

export default MediaPage;
