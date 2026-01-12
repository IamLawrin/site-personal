import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const success = login(password);
    
    if (success) {
      setPassword('');
      onClose();
    } else {
      setError('Parolă incorectă');
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-900 border border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-500" />
            Admin Login
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Introdu parola de admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 pr-10 focus:border-red-500 focus:ring-red-500/20"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm flex items-center gap-2">
              <X className="w-4 h-4" />
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-red-500 hover:bg-red-600 text-white transition-all"
          >
            {isLoading ? 'Se verifică...' : 'Autentificare'}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Doar administratorul site-ului are acces
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginModal;
