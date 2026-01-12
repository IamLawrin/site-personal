import React, { useState } from 'react';
import { Send, Mail, User, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { profileData } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { contactAPI } from '../services/api';

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await contactAPI.send(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('A apărut o eroare. Te rog încearcă din nou.');
      console.error('Error sending message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-red-500 text-sm font-mono uppercase tracking-wider">{t('contact.title')}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            {t('contact.heading')}
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="md:col-span-2">
            <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">{t('contact.contactInfo')}</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <Mail className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{t('contact.email')}</p>
                    <a href={`mailto:${profileData.email}`} className="text-white hover:text-red-400 transition-colors">
                      {profileData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <User className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{t('contact.studentAt')}</p>
                    <p className="text-white">{profileData.university}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t('contact.responseTime')}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="bg-zinc-900 rounded-2xl p-10 border border-green-500/30 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('contact.messageSent')}</h3>
                <p className="text-gray-400">
                  {t('contact.thankYou')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-gray-300 mb-2 block">
                        <User className="w-4 h-4 inline mr-2" />
                        {t('contact.name')}
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-black/50 border-white/20 text-white focus:border-red-500"
                        placeholder={t('contact.yourName')}
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">
                        <Mail className="w-4 h-4 inline mr-2" />
                        {t('contact.email')}
                      </Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-black/50 border-white/20 text-white focus:border-red-500"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">
                      <FileText className="w-4 h-4 inline mr-2" />
                      {t('contact.subject')}
                    </Label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-black/50 border-white/20 text-white focus:border-red-500"
                      placeholder={t('contact.aboutWhat')}
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      {t('contact.message')}
                    </Label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-black/50 border-white/20 text-white focus:border-red-500 min-h-32"
                      placeholder={t('contact.writeMessage')}
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-6 text-lg rounded-xl transition-all"
                  >
                    {isSubmitting ? (
                      t('contact.sending')
                    ) : (
                      <>
                        {t('contact.sendMessage')}
                        <Send className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
