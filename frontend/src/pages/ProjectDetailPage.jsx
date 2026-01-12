import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, ExternalLink, ChevronLeft, ChevronRight, X, Edit2, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../services/api';
import ProjectGalleryModal from '../components/projects/ProjectGalleryModal';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch project from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectsAPI.getById(id);
        // Add default gallery if not present
        setProject({
          ...data,
          gallery: data.gallery?.length > 0 ? data.gallery : [data.image].filter(Boolean),
          longDescription: data.longDescription || `${data.description}\n\nAcest proiect a fost realizat folosind tehnologii moderne și reprezintă o soluție inovatoare în domeniul ${data.category?.toLowerCase() || 'tehnologie'}. Am lucrat la el timp de câteva săptămâni, parcurgând toate etapele de la concept la implementare.\n\nProiectul include multiple funcționalități și a fost optimizat pentru performanță și ușurință în utilizare.`
        });
      } catch (error) {
        console.error('Error fetching project:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Proiectul nu a fost găsit.</p>
          <Button onClick={() => navigate('/projects')} variant="outline" className="border-white/20 text-white">
            Înapoi la proiecte
          </Button>
        </div>
      </div>
    );
  }

  const openImageViewer = (index) => {
    setSelectedImageIndex(index);
  };

  const closeImageViewer = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex(prev => (prev + 1) % project.gallery.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex(prev => (prev - 1 + project.gallery.length) % project.gallery.length);
  };

  const handleAddImages = (newImages) => {
    setProject(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...newImages]
    }));
    setGalleryModalOpen(false);
  };

  const handleDeleteImage = (index, e) => {
    e.stopPropagation();
    if (project.gallery.length <= 1) {
      alert('Proiectul trebuie să aibă cel puțin o imagine.');
      return;
    }
    if (window.confirm('Ștergi această imagine?')) {
      setProject(prev => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Back Navigation */}
      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Înapoi la proiecte</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="px-4 sm:px-6 mb-8">
        <div className="max-w-6xl mx-auto">
          <div 
            className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer group"
            onClick={() => openImageViewer(0)}
          >
            <img
              src={project.gallery[0]}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
            
            {/* Category Badge */}
            <Badge className="absolute top-4 left-4 bg-red-500/90 text-white border-none text-sm">
              {project.category}
            </Badge>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="px-4 sm:px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {project.title}
              </h1>
              
              <p className="text-xl text-gray-400 mb-8">
                {project.description}
              </p>

              {/* Long Description */}
              <div className="prose prose-invert max-w-none">
                {project.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-300 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10 sticky top-24">
                {/* Date */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                  <Calendar className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-gray-500 text-sm">Data</p>
                    <p className="text-white">
                      {new Date(project.date).toLocaleDateString('ro-RO', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-5 h-5 text-red-500" />
                    <p className="text-gray-500 text-sm">Tehnologii</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-white/5 text-gray-300 rounded-full border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Admin Edit */}
                {isAdmin && (
                  <Button
                    onClick={() => navigate(`/projects?edit=${project.id}`)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editează Proiect
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Galerie</h2>
            {isAdmin && (
              <Button
                onClick={() => setGalleryModalOpen(true)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adaugă Imagini
              </Button>
            )}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {project.gallery.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-[4/3] bg-zinc-900 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => openImageViewer(index)}
              >
                <img
                  src={image}
                  alt={`${project.title} - ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />

                {/* Admin delete */}
                {isAdmin && project.gallery.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteImage(index, e)}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-screen Image Viewer */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeImageViewer}
        >
          <button
            onClick={closeImageViewer}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {project.gallery.length > 1 && (
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
            src={project.gallery[selectedImageIndex]}
            alt={`${project.title} - ${selectedImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Image counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
            {selectedImageIndex + 1} / {project.gallery.length}
          </div>
        </div>
      )}

      {/* Gallery Modal for adding images */}
      <ProjectGalleryModal
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        onSave={handleAddImages}
      />
    </div>
  );
};

export default ProjectDetailPage;
