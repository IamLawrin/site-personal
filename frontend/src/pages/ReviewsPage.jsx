import React, { useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockReviews } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ReviewCard from '../components/reviews/ReviewCard';
import ReviewModal from '../components/reviews/ReviewModal';

const ReviewsPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [reviews, setReviews] = useState(mockReviews);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const handleAddReview = () => {
    setEditingReview(null);
    setModalOpen(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setModalOpen(true);
  };

  const handleDeleteReview = (id) => {
    if (window.confirm('Ești sigur că vrei să ștergi această recenzie?')) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const handleSaveReview = (reviewData) => {
    if (editingReview) {
      setReviews(reviews.map(r => 
        r.id === editingReview.id ? { ...r, ...reviewData } : r
      ));
    } else {
      const newReview = {
        ...reviewData,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      };
      setReviews([newReview, ...reviews]);
    }
    setModalOpen(false);
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <span className="text-red-500 text-sm font-mono uppercase tracking-wider">{t('reviews.testimonials')}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            {t('reviews.title')}
          </h1>
          <p className="text-gray-400 max-w-2xl mb-6">
            {t('reviews.description')}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white">{avgRating}</span>
              <Star className="w-6 h-6 text-red-500 fill-red-500" />
            </div>
            <div className="text-gray-500">
              {t('reviews.from')} {reviews.length} {t('reviews.reviewsCount')}
            </div>

            {isAdmin && (
              <Button
                onClick={handleAddReview}
                className="ml-auto bg-red-500 hover:bg-red-600 text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('reviews.addReview')}
              </Button>
            )}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">{t('reviews.noReviews')}</p>
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        review={editingReview}
        onSave={handleSaveReview}
      />
    </div>
  );
};

export default ReviewsPage;
