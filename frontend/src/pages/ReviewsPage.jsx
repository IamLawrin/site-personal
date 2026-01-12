import React, { useState, useEffect } from 'react';
import { Plus, Star, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { reviewsAPI } from '../services/api';
import ReviewCard from '../components/reviews/ReviewCard';
import ReviewModal from '../components/reviews/ReviewModal';

const ReviewsPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewsAPI.getAll();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleAddReview = () => {
    setEditingReview(null);
    setModalOpen(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setModalOpen(true);
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Ești sigur că vrei să ștergi această recenzie?')) {
      try {
        await reviewsAPI.delete(id);
        setReviews(reviews.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleSaveReview = async (reviewData) => {
    try {
      if (editingReview) {
        const updated = await reviewsAPI.update(editingReview.id, reviewData);
        setReviews(reviews.map(r => r.id === editingReview.id ? updated : r));
      } else {
        const newReview = await reviewsAPI.create(reviewData);
        setReviews([newReview, ...reviews]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

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
