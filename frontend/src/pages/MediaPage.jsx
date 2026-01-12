import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Grid, FolderOpen, Plus, Settings, LogOut, Lock, ChevronLeft, ChevronRight, X, Upload, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminLoginModal from '../components/admin/AdminLoginModal';
import MediaUploadModal from '../components/media/MediaUploadModal';
import AlbumModal from '../components/media/AlbumModal';
import { mockGalleryImages } from '../data/mockData';

const MediaPage = () => {
  const { isAdmin, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeAlbum, setActiveAlbum] = useState('all');
  const [editingAlbum, setEditingAlbum] = useState(null);
  
  // Mock data for albums
  const [albums, setAlbums] = useState([
    { id: 'all', name: 'Toate', count: 0 },
    { id: 'electronics', name: 'Electronică', count: 0 },
    { id: 'workspace', name: 'Workspace', count: 0 },
    { id: 'projects', name: 'Proiecte', count: 0 },
  ]);

  const [images, setImages] = useState(mockGalleryImages.map(img => ({
    ...img,
    albumId: img.category.toLowerCase() === 'electronics' ? 'electronics' : 
             img.category.toLowerCase() === 'workspace' ? 'workspace' : 'projects'
  })));

  // Featured images for slideshow
  const featuredImages = images.slice(0, 5);

  // Filter images by album
  const filteredImages = activeAlbum === 'all' 
    ? images 
    : images.filter(img => img.albumId === activeAlbum);

  // Update album counts
  useEffect(() => {
    setAlbums(prev => prev.map(album => ({
      ...album,
      count: album.id === 'all' ? images.length : images.filter(img => img.albumId === album.id).length
    })));
  }, [images]);

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredImages.length]);

  const handleAddImage = (imageData) => {
    const newImage = {
      ...imageData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setImages(prev => [newImage, ...prev]);
    setUploadModalOpen(false);
  };

  const handleDeleteImage = (id) => {
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
        count: 0
      };
      setAlbums(prev => [...prev, newAlbum]);
    }
    setAlbumModalOpen(false);
    setEditingAlbum(null);
  };

  const handleDeleteAlbum = (albumId) => {
    if (albumId === 'all') return;
    if (window.confirm('Ștergi acest album? Imaginile vor fi mutate în "Toate".')) {
      setImages(prev => prev.map(img => img.albumId === albumId ? { ...img, albumId: 'projects' } : img));
      setAlbums(prev => prev.filter(a => a.id !== albumId));
      if (activeAlbum === albumId) setActiveAlbum('all');
    }
  };

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % featuredImages.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + featuredImages.length) % featuredImages.length);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header - Hide on scroll */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="bg-black/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Back to main site */}
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Înapoi la site</span>
              </Link>

              {/* Center - Title */}
              <h1 className="text-white font-light text-lg tracking-wide">Media Gallery</h1>

              {/* Right - Admin */}
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => setUploadModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                    <button
                      onClick={logout}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setLoginModalOpen(true)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Lock className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Quote */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl md:text-4xl font-light text-white leading-relaxed mb-6">
            "Fiecare imagine spune o poveste. Aici sunt poveștile mele."
          </blockquote>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            O colecție de momente capturate din proiectele mele de electronică, 
            workshop și călătoria mea ca student și creator.
          </p>
        </div>
      </section>

      {/* Featured Slideshow */}
      {featuredImages.length > 0 && (
        <section className="relative mb-16 mx-6">
          <div className="max-w-[1800px] mx-auto">
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-zinc-900">
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
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setSelectedImage(img)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-white font-medium text-lg">{img.title}</p>
                    <p className="text-gray-300 text-sm">{img.category}</p>
                  </div>
                </div>
              ))}

              {/* Slideshow Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-6 right-6 flex gap-2">
                {featuredImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Albums Navigation */}
      <section className="px-6 mb-8">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <FolderOpen className="w-5 h-5 text-gray-500 flex-shrink-0" />
            {albums.map((album) => (
              <button
                key={album.id}
                onClick={() => setActiveAlbum(album.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  activeAlbum === album.id
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {album.name}
                <span className={`text-xs ${activeAlbum === album.id ? 'text-gray-600' : 'text-gray-500'}`}>
                  {album.count}
                </span>
              </button>
            ))}
            
            {isAdmin && (
              <button
                onClick={() => { setEditingAlbum(null); setAlbumModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Album nou
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Image Grid - Large images, max 3 per row */}
      <section className="px-6 pb-16">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredImages.map((image) => (
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
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-medium">{image.title}</p>
                  <p className="text-gray-300 text-sm">{image.category}</p>
                </div>

                {/* Admin delete button */}
                {isAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteImage(image.id); }}
                    className="absolute top-3 right-3 p-2 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-20">
              <Grid className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">Nu există imagini în acest album.</p>
              {isAdmin && (
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all"
                >
                  Adaugă prima imagine
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Full-screen Image Viewer */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <img
            src={selectedImage.url}
            alt={selectedImage.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="absolute bottom-6 left-6 text-white">
            <p className="font-medium text-lg">{selectedImage.title}</p>
            <p className="text-gray-400">{selectedImage.category}</p>
          </div>
        </div>
      )}

      {/* Modals */}
      <AdminLoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
      
      <MediaUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSave={handleAddImage}
        albums={albums.filter(a => a.id !== 'all')}
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
