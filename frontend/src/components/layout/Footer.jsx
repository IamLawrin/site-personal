import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Github, Mail, Heart } from 'lucide-react';
import { profileData } from '../../data/mockData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white">lwr</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {profileData.bio}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigare</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-400 transition-colors text-sm">
                  Acasă
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-red-400 transition-colors text-sm">
                  Proiecte
                </Link>
              </li>
              <li>
                <Link to="/media" className="text-gray-400 hover:text-red-400 transition-colors text-sm">
                  Media
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-red-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Conectează-te</h3>
            <div className="flex gap-3 mb-4">
              <a
                href={profileData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-red-400 hover:bg-white/10 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={profileData.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-red-400 hover:bg-white/10 transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={profileData.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-red-400 hover:bg-white/10 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
            <a
              href={`mailto:${profileData.email}`}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              {profileData.email}
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
            © {currentYear} lwr.ro • Made with <Heart className="w-4 h-4 text-red-500" /> by {profileData.shortName}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
