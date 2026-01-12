import React from 'react';
import { Star, Edit2, Trash2, Quote } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';

const ReviewCard = ({ review, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="group relative bg-zinc-900 rounded-2xl p-6 border border-white/10 hover:border-red-500/30 transition-all duration-300">
      {/* Quote Icon */}
      <Quote className="w-8 h-8 text-red-500/30 mb-4" />

      {/* Admin Actions */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 text-white h-8 w-8 p-0"
            onClick={() => onEdit && onEdit(review)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 w-8 p-0"
            onClick={() => onDelete && onDelete(review.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Content */}
      <p className="text-gray-300 leading-relaxed mb-6">
        "{review.content}"
      </p>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < review.rating ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
          />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
          <span className="text-red-400 font-semibold">
            {review.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-white font-medium text-sm">{review.name}</p>
          <p className="text-gray-500 text-xs">{review.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
