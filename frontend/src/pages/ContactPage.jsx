import React, { useState } from 'react';
import { Send, Mail, User, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { profileData } from '../data/mockData';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call (will be replaced with actual backend)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For now, just show success
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);

    // Reset after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-red-500 text-sm font-mono uppercase tracking-wider">Contact</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Hai să vorbim
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Ai o întrebare sau vrei să colaborăm la un proiect? Trimite-mi un mesaj!
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="md:col-span-2">
            <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">Informații de contact</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <Mail className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
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
                    <p className="text-gray-400 text-sm">Student la</p>
                    <p className="text-white">{profileData.university}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm leading-relaxed">
                  Răspund de obicei în 24-48 de ore. Pentru proiecte urgente, 
                  te rog să menționezi acest lucru în mesaj.
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
                <h3 className="text-xl font-semibold text-white mb-2">Mesaj trimis!</h3>
                <p className="text-gray-400">
                  Îți mulțumesc pentru mesaj. Voi răspunde cât de curând posibil.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-gray-300 mb-2 block">
                        <User className="w-4 h-4 inline mr-2" />
                        Nume
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-black/50 border-white/20 text-white focus:border-red-500"
                        placeholder="Numele tău"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
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
                      Subiect
                    </Label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-black/50 border-white/20 text-white focus:border-red-500"
                      placeholder="Despre ce e vorba?"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Mesaj
                    </Label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-black/50 border-white/20 text-white focus:border-red-500 min-h-32"
                      placeholder="Scrie mesajul tău aici..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-6 text-lg rounded-xl transition-all"
                  >
                    {isSubmitting ? (
                      'Se trimite...'
                    ) : (
                      <>
                        Trimite Mesaj
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
