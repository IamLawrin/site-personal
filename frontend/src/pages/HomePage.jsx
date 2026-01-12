import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Code, Zap, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { profileData, mockProjects, mockReviews } from '../data/mockData';
import ProjectCard from '../components/projects/ProjectCard';
import ReviewCard from '../components/reviews/ReviewCard';

const HomePage = () => {
  const featuredProjects = mockProjects.filter(p => p.featured).slice(0, 2);
  const latestReviews = mockReviews.slice(0, 3);

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
            <span className="text-sm text-gray-300">Disponibil pentru proiecte</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
            Salut, sunt{' '}
            <span className="text-red-500">{profileData.shortName}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-2xl mx-auto">
            {profileData.title}
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
            {profileData.faculty}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects">
              <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg rounded-full transition-all hover:scale-105">
                Vezi Proiectele
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full">
                Contactează-mă
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
              <span className="text-red-500 text-sm font-mono uppercase tracking-wider">Despre mine</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                {profileData.name}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                {profileData.bio}
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Student la {profileData.university}, pasionat de electronică, programare embedded și dezvoltare web. 
                Îmi place să transform ideile în proiecte funcționale.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-3xl font-bold text-red-500">{mockProjects.length}+</span>
                  <p className="text-gray-400 text-sm mt-1">Proiecte</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-3xl font-bold text-red-500">{profileData.age}</span>
                  <p className="text-gray-400 text-sm mt-1">Ani</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-3xl font-bold text-red-500">{mockReviews.length}+</span>
                  <p className="text-gray-400 text-sm mt-1">Recenzii</p>
                </div>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl border border-red-500/20">
                <Cpu className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-white font-semibold text-lg mb-2">Electronică</h3>
                <p className="text-gray-400 text-sm">Arduino, ESP32, Raspberry Pi, PCB Design</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/10">
                <Code className="w-10 h-10 text-red-400 mb-4" />
                <h3 className="text-white font-semibold text-lg mb-2">Programare</h3>
                <p className="text-gray-400 text-sm">C/C++, Python, JavaScript, React</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/10">
                <Zap className="w-10 h-10 text-red-400 mb-4" />
                <h3 className="text-white font-semibold text-lg mb-2">IoT & Automation</h3>
                <p className="text-gray-400 text-sm">Smart Home, MQTT, Senzori, Automatizări</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl border border-red-500/20">
                <span className="text-4xl mb-4 block">🎓</span>
                <h3 className="text-white font-semibold text-lg mb-2">Student</h3>
                <p className="text-gray-400 text-sm">Facultatea de Transporturi, Electronică</p>
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
              <span className="text-red-500 text-sm font-mono uppercase tracking-wider">Portofoliu</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Proiecte Recente</h2>
            </div>
            <Link to="/projects">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Vezi toate
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
            <span className="text-red-500 text-sm font-mono uppercase tracking-wider">Testimoniale</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Ce spun alții</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {latestReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/reviews">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                Vezi toate recenziile
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
            Ai un proiect în minte?
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Sunt mereu deschis la noi colaborări și provocări interesante.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-10 py-6 text-lg rounded-full transition-all hover:scale-105">
              Hai să vorbim
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
