import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Lock, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import AdminLoginModal from '../admin/AdminLoginModal';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { isAdmin, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Acasă' },
    { path: '/projects', label: 'Proiecte' },
    { path: '/media', label: 'Media' },
    { path: '/reviews', label: 'Recenzii' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">lwr</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-red-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Admin Button */}
            <div className="hidden md:flex items-center gap-2">
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400 flex items-center gap-1">
                    <Settings className="w-3 h-3" />
                    Admin Mode
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLoginModalOpen(true)}
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <Lock className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-white/10">
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-red-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                {isAdmin ? (
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Deconectare Admin
                  </button>
                ) : (
                  <button
                    onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white w-full"
                  >
                    <Lock className="w-4 h-4" />
                    Admin Login
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <AdminLoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </>
  );
};

export default Header;
