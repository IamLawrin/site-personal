import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

const ReviewModal = ({ isOpen, onClose, review, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5
  });

  useEffect(() => {
    if (review) {
      setFormData({
        name: review.name || '',
        role: review.role || '',
        content: review.content || '',
        rating: review.rating || 5
      });
    } else {
      setFormData({
        name: '',
        role: '',
        content: '',
        rating: 5
      });
    }
  }, [review, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border border-white/10 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">
            {review ? 'Editează Recenzie' : 'Adaugă Recenzie Nouă'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label className="text-gray-300">Nume</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-black/50 border-white/20 text-white mt-1"
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">Rol / Relație</Label>
            <Input
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="ex: Coleg, Client, Prieten"
              className="bg-black/50 border-white/20 text-white mt-1"
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">Conținut recenzie</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="bg-black/50 border-white/20 text-white mt-1 min-h-24"
              required
            />
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block">Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= formData.rating
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 text-gray-400 hover:text-white"
            >
              Anulează
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {review ? 'Salvează' : 'Adaugă'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
