import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockProjects } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ProjectCard, { AddProjectCard } from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';

const ProjectsPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [projects, setProjects] = useState(mockProjects);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const categories = ['all', ...new Set(projects.map(p => p.category))];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const handleAddProject = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Ești sigur că vrei să ștergi acest proiect?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      setProjects(projects.map(p => 
        p.id === editingProject.id ? { ...p, ...projectData } : p
      ));
    } else {
      const newProject = {
        ...projectData,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      };
      setProjects([newProject, ...projects]);
    }
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <span className="text-red-500 text-sm font-mono uppercase tracking-wider">{t('projects.portfolio')}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            {t('projects.myProjects')}
          </h1>
          <p className="text-gray-400 max-w-2xl">
            {t('projects.description')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Filter className="w-5 h-5 text-gray-500" />
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
              {category === 'all' ? t('projects.all') : category}
            </button>
          ))}

          {isAdmin && (
            <Button
              onClick={handleAddProject}
              className="ml-auto bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('projects.addProject')}
            </Button>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isAdmin && <AddProjectCard onClick={handleAddProject} />}
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">{t('projects.noProjects')}</p>
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        project={editingProject}
        onSave={handleSaveProject}
      />
    </div>
  );
};

export default ProjectsPage;
