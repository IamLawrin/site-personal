import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

// Helper to check if item is new (added within last 7 days)
const isNew = (dateString) => {
  const itemDate = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const showNewBadge = isNew(project.date);

  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit && onEdit(project);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete && onDelete(project.id);
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <div className={`absolute inset-0 bg-zinc-800 ${imageLoaded ? 'hidden' : 'animate-pulse'}`} />
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onLoad={() => setImageLoaded(true)}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <Badge className="absolute top-4 left-4 bg-red-500/90 text-white border-none">
          {project.category}
        </Badge>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-black h-8 w-8 p-0"
              onClick={handleEdit}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8 w-8 p-0"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded-full border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Date */}
        <p className="text-xs text-gray-500">
          {new Date(project.date).toLocaleDateString('ro-RO', { 
            year: 'numeric', 
            month: 'long' 
          })}
        </p>
      </div>
    </div>
  );
};

// Add Project Card (shown only in admin mode)
export const AddProjectCard = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-zinc-900/50 rounded-2xl overflow-hidden border-2 border-dashed border-white/20 hover:border-red-500/50 transition-all duration-300 aspect-[4/3] flex items-center justify-center"
    >
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500/30 transition-colors">
          <Plus className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-gray-400 group-hover:text-white transition-colors">Adaugă proiect nou</p>
      </div>
    </button>
  );
};

export default ProjectCard;
