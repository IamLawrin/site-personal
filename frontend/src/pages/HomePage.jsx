import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Code, Zap, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { profileData } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { projectsAPI, reviewsAPI } from '../services/api';
import ProjectCard from '../components/projects/ProjectCard';
import ReviewCard from '../components/reviews/ReviewCard';

const HomePage = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, reviewsData] = await Promise.all([
          projectsAPI.getAll(),
          reviewsAPI.getAll()
        ]);
        setProjects(projectsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const featuredProjects = projects.filter(p => p.featured).slice(0, 2);
  const latestReviews = reviews.slice(0, 3);

  const scrollToContent = () => {
    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">{t('home.availableForProjects')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
            {t('home.greeting')}{' '}
            <span className="text-red-500">{profileData.shortName}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-2xl mx-auto">
            {t('home.title')}
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
            {profileData.faculty}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects">
              <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg rounded-full transition-all hover:scale-105">
                {t('home.viewProjects')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full">
                {t('home.contactMe')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 hover:text-white transition-colors animate-bounce"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <span className="text-red-500 text-sm font-mono uppercase tracking-wider">{t('home.aboutMe')}</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                {profileData.name}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                {t('home.bio')}
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                {t('home.bioExtended')}
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-3xl font-bold text-red-500">{mockProjects.length}+</span>
                  <p className="text-gray-400 text-sm mt-1">{t('home.projects')}</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-3xl font-bold text-red-500">{profileData.age}</span>
                  <p className="text-gray-400 text-sm mt-1">{t('home.age')}</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-3xl font-bold text-red-500">{mockReviews.length}+</span>
                  <p className="text-gray-400 text-sm mt-1">{t('home.reviews')}</p>
                </div>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl border border-red-500/20">
                <Cpu className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-white font-semibold text-lg mb-2">{t('home.electronics')}</h3>
                <p className="text-gray-400 text-sm">{t('home.electronicsDesc')}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/10">
                <Code className="w-10 h-10 text-red-400 mb-4" />
                <h3 className="text-white font-semibold text-lg mb-2">{t('home.programming')}</h3>
                <p className="text-gray-400 text-sm">{t('home.programmingDesc')}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/10">
                <Zap className="w-10 h-10 text-red-400 mb-4" />
                <h3 className="text-white font-semibold text-lg mb-2">{t('home.iotAutomation')}</h3>
                <p className="text-gray-400 text-sm">{t('home.iotDesc')}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl border border-red-500/20">
                <span className="text-4xl mb-4 block">🎓</span>
                <h3 className="text-white font-semibold text-lg mb-2">{t('home.student')}</h3>
                <p className="text-gray-400 text-sm">{t('home.studentDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-red-500 text-sm font-mono uppercase tracking-wider">{t('home.portfolio')}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{t('home.recentProjects')}</h2>
            </div>
            <Link to="/projects">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                {t('home.viewAll')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-red-500 text-sm font-mono uppercase tracking-wider">{t('home.testimonials')}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{t('home.whatOthersSay')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {latestReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/reviews">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                {t('home.viewAllReviews')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t('home.haveProject')}
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            {t('home.openToCollaboration')}
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-10 py-6 text-lg rounded-full transition-all hover:scale-105">
              {t('home.letsTalk')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
