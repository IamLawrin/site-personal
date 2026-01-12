import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  ro: {
    // Navigation
    nav: {
      home: 'Acasă',
      projects: 'Proiecte',
      media: 'Media',
      reviews: 'Recenzii',
      contact: 'Contact',
      adminMode: 'Admin Mode',
      adminLogin: 'Admin Login',
      logout: 'Deconectare',
    },
    // Homepage
    home: {
      availableForProjects: 'Disponibil pentru proiecte',
      greeting: 'Salut, sunt',
      title: 'Student Electronică & Developer',
      viewProjects: 'Vezi Proiectele',
      contactMe: 'Contactează-mă',
      aboutMe: 'Despre mine',
      bio: 'Pasionat de electronică, programare și proiecte creative. Transform ideile în realitate prin circuite și cod.',
      bioExtended: 'Student la Universitatea Politehnica București, pasionat de electronică, programare embedded și dezvoltare web. Îmi place să transform ideile în proiecte funcționale.',
      projects: 'Proiecte',
      age: 'Ani',
      reviews: 'Recenzii',
      electronics: 'Electronică',
      electronicsDesc: 'Arduino, ESP32, Raspberry Pi, PCB Design',
      programming: 'Programare',
      programmingDesc: 'C/C++, Python, JavaScript, React',
      iotAutomation: 'IoT & Automation',
      iotDesc: 'Smart Home, MQTT, Senzori, Automatizări',
      student: 'Student',
      studentDesc: 'Facultatea de Transporturi, Electronică',
      portfolio: 'Portofoliu',
      recentProjects: 'Proiecte Recente',
      viewAll: 'Vezi toate',
      testimonials: 'Testimoniale',
      whatOthersSay: 'Ce spun alții',
      viewAllReviews: 'Vezi toate recenziile',
      haveProject: 'Ai un proiect în minte?',
      openToCollaboration: 'Sunt mereu deschis la noi colaborări și provocări interesante.',
      letsTalk: 'Hai să vorbim',
    },
    // Projects Page
    projects: {
      portfolio: 'Portofoliu',
      myProjects: 'Proiectele Mele',
      description: 'O colecție de proiecte din domeniul electronicii, programație și alte pasiuni personale.',
      all: 'Toate',
      addProject: 'Adaugă Proiect',
      addNewProject: 'Adaugă proiect nou',
      noProjects: 'Nu există proiecte în această categorie.',
      backToProjects: 'Înapoi la proiecte',
      date: 'Data',
      technologies: 'Tehnologii',
      editProject: 'Editează Proiect',
      gallery: 'Galerie',
      addImages: 'Adaugă Imagini',
    },
    // Media Page
    media: {
      gallery: 'Galerie',
      title: 'Media',
      quote: '"Fiecare imagine spune o poveste. Aici sunt poveștile mele."',
      description: 'O colecție de momente capturate din proiectele mele de electronică, workshop și călătoria mea ca student și creator.',
      albums: 'Albume',
      newAlbum: 'Album nou',
      createNewAlbum: 'Creează album nou',
      images: 'imagini',
      backToAlbums: 'Înapoi la albume',
      upload: 'Upload',
      editAlbum: 'Editează Album',
      noImages: 'Nu există imagini în acest album.',
      addFirstImage: 'Adaugă prima imagine',
    },
    // Reviews Page
    reviews: {
      testimonials: 'Testimoniale',
      title: 'Recenzii',
      description: 'Părerile colegilor, prietenilor și clienților despre colaborările noastre.',
      from: 'din',
      reviewsCount: 'recenzii',
      addReview: 'Adaugă Recenzie',
      noReviews: 'Nu există recenzii încă.',
    },
    // Contact Page
    contact: {
      title: 'Contact',
      heading: 'Hai să vorbim',
      description: 'Ai o întrebare sau vrei să colaborăm la un proiect? Trimite-mi un mesaj!',
      contactInfo: 'Informații de contact',
      email: 'Email',
      studentAt: 'Student la',
      responseTime: 'Răspund de obicei în 24-48 de ore. Pentru proiecte urgente, te rog să menționezi acest lucru în mesaj.',
      name: 'Nume',
      yourName: 'Numele tău',
      subject: 'Subiect',
      aboutWhat: 'Despre ce e vorba?',
      message: 'Mesaj',
      writeMessage: 'Scrie mesajul tău aici...',
      sendMessage: 'Trimite Mesaj',
      sending: 'Se trimite...',
      messageSent: 'Mesaj trimis!',
      thankYou: 'Îți mulțumesc pentru mesaj. Voi răspunde cât de curând posibil.',
    },
    // Footer
    footer: {
      navigation: 'Navigare',
      connect: 'Conectează-te',
      madeWith: 'Made with',
      by: 'by',
    },
    // Admin
    admin: {
      login: 'Admin Login',
      enterPassword: 'Introdu parola de admin',
      authenticate: 'Autentificare',
      verifying: 'Se verifică...',
      wrongPassword: 'Parolă incorectă',
      onlyAdmin: 'Doar administratorul site-ului are acces',
    },
    // Modals
    modals: {
      addProject: 'Adaugă Proiect Nou',
      editProject: 'Editează Proiect',
      projectImage: 'Imagine Proiect',
      orImageUrl: 'Sau URL Imagine',
      title: 'Titlu',
      description: 'Descriere',
      category: 'Categorie',
      categoryPlaceholder: 'ex: Electronics, Web Development',
      technologiesLabel: 'Tehnologii (separate prin virgulă)',
      technologiesPlaceholder: 'React, Node.js, Arduino',
      featuredProject: 'Proiect featured (afișat pe prima pagină)',
      cancel: 'Anulează',
      save: 'Salvează',
      add: 'Adaugă',
      create: 'Creează',
      delete: 'Șterge',
      uploadImage: 'Upload Imagine',
      dragOrClick: 'Trage imaginea aici sau click pentru a selecta',
      dragOrClickMultiple: 'Trage imaginile aici sau click pentru a selecta',
      selectMultiple: 'Poți selecta mai multe imagini deodată',
      fileTypes: 'PNG, JPG, WebP până la 10MB',
      uploading: 'Se încarcă...',
      imageName: 'Numele imaginii',
      selectAlbum: 'Selectează albumul',
      album: 'Album',
      newAlbum: 'Album Nou',
      editAlbum: 'Editează Album',
      albumName: 'Nume Album',
      albumNamePlaceholder: 'ex: Proiecte Arduino',
      albumDescription: 'Descriere',
      albumDescPlaceholder: 'Scurtă descriere a albumului',
      coverImage: 'Imagine Copertă',
      clickOrDrag: 'Click sau trage imaginea',
      addToGallery: 'Adaugă Imagini la Galerie',
      addReview: 'Adaugă Recenzie Nouă',
      editReview: 'Editează Recenzie',
      reviewerName: 'Nume',
      reviewerRole: 'Rol / Relație',
      reviewerRolePlaceholder: 'ex: Coleg, Client, Prieten',
      reviewContent: 'Conținut recenzie',
      rating: 'Rating',
    },
    // Common
    common: {
      loading: 'Se încarcă...',
      error: 'Eroare',
      success: 'Succes',
      confirm: 'Confirmare',
      yes: 'Da',
      no: 'Nu',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      projects: 'Projects',
      media: 'Media',
      reviews: 'Reviews',
      contact: 'Contact',
      adminMode: 'Admin Mode',
      adminLogin: 'Admin Login',
      logout: 'Logout',
    },
    // Homepage
    home: {
      availableForProjects: 'Available for projects',
      greeting: 'Hi, I\'m',
      title: 'Electronics Student & Developer',
      viewProjects: 'View Projects',
      contactMe: 'Contact Me',
      aboutMe: 'About me',
      bio: 'Passionate about electronics, programming and creative projects. Turning ideas into reality through circuits and code.',
      bioExtended: 'Student at Politehnica University of Bucharest, passionate about electronics, embedded programming and web development. I love turning ideas into functional projects.',
      projects: 'Projects',
      age: 'Years',
      reviews: 'Reviews',
      electronics: 'Electronics',
      electronicsDesc: 'Arduino, ESP32, Raspberry Pi, PCB Design',
      programming: 'Programming',
      programmingDesc: 'C/C++, Python, JavaScript, React',
      iotAutomation: 'IoT & Automation',
      iotDesc: 'Smart Home, MQTT, Sensors, Automations',
      student: 'Student',
      studentDesc: 'Faculty of Transport, Electronics',
      portfolio: 'Portfolio',
      recentProjects: 'Recent Projects',
      viewAll: 'View all',
      testimonials: 'Testimonials',
      whatOthersSay: 'What others say',
      viewAllReviews: 'View all reviews',
      haveProject: 'Have a project in mind?',
      openToCollaboration: 'I\'m always open to new collaborations and interesting challenges.',
      letsTalk: 'Let\'s talk',
    },
    // Projects Page
    projects: {
      portfolio: 'Portfolio',
      myProjects: 'My Projects',
      description: 'A collection of projects in electronics, programming and other personal passions.',
      all: 'All',
      addProject: 'Add Project',
      addNewProject: 'Add new project',
      noProjects: 'No projects in this category.',
      backToProjects: 'Back to projects',
      date: 'Date',
      technologies: 'Technologies',
      editProject: 'Edit Project',
      gallery: 'Gallery',
      addImages: 'Add Images',
    },
    // Media Page
    media: {
      gallery: 'Gallery',
      title: 'Media',
      quote: '"Every image tells a story. Here are my stories."',
      description: 'A collection of moments captured from my electronics projects, workshop and my journey as a student and creator.',
      albums: 'Albums',
      newAlbum: 'New album',
      createNewAlbum: 'Create new album',
      images: 'images',
      backToAlbums: 'Back to albums',
      upload: 'Upload',
      editAlbum: 'Edit Album',
      noImages: 'No images in this album.',
      addFirstImage: 'Add first image',
    },
    // Reviews Page
    reviews: {
      testimonials: 'Testimonials',
      title: 'Reviews',
      description: 'Opinions from colleagues, friends and clients about our collaborations.',
      from: 'from',
      reviewsCount: 'reviews',
      addReview: 'Add Review',
      noReviews: 'No reviews yet.',
    },
    // Contact Page
    contact: {
      title: 'Contact',
      heading: 'Let\'s talk',
      description: 'Have a question or want to collaborate on a project? Send me a message!',
      contactInfo: 'Contact information',
      email: 'Email',
      studentAt: 'Student at',
      responseTime: 'I usually respond within 24-48 hours. For urgent projects, please mention this in your message.',
      name: 'Name',
      yourName: 'Your name',
      subject: 'Subject',
      aboutWhat: 'What is it about?',
      message: 'Message',
      writeMessage: 'Write your message here...',
      sendMessage: 'Send Message',
      sending: 'Sending...',
      messageSent: 'Message sent!',
      thankYou: 'Thank you for your message. I will respond as soon as possible.',
    },
    // Footer
    footer: {
      navigation: 'Navigation',
      connect: 'Connect',
      madeWith: 'Made with',
      by: 'by',
    },
    // Admin
    admin: {
      login: 'Admin Login',
      enterPassword: 'Enter admin password',
      authenticate: 'Login',
      verifying: 'Verifying...',
      wrongPassword: 'Wrong password',
      onlyAdmin: 'Only the site administrator has access',
    },
    // Modals
    modals: {
      addProject: 'Add New Project',
      editProject: 'Edit Project',
      projectImage: 'Project Image',
      orImageUrl: 'Or Image URL',
      title: 'Title',
      description: 'Description',
      category: 'Category',
      categoryPlaceholder: 'e.g.: Electronics, Web Development',
      technologiesLabel: 'Technologies (comma separated)',
      technologiesPlaceholder: 'React, Node.js, Arduino',
      featuredProject: 'Featured project (shown on homepage)',
      cancel: 'Cancel',
      save: 'Save',
      add: 'Add',
      create: 'Create',
      delete: 'Delete',
      uploadImage: 'Upload Image',
      dragOrClick: 'Drag image here or click to select',
      dragOrClickMultiple: 'Drag images here or click to select',
      selectMultiple: 'You can select multiple images at once',
      fileTypes: 'PNG, JPG, WebP up to 10MB',
      uploading: 'Uploading...',
      imageName: 'Image name',
      selectAlbum: 'Select album',
      album: 'Album',
      newAlbum: 'New Album',
      editAlbum: 'Edit Album',
      albumName: 'Album Name',
      albumNamePlaceholder: 'e.g.: Arduino Projects',
      albumDescription: 'Description',
      albumDescPlaceholder: 'Short description of the album',
      coverImage: 'Cover Image',
      clickOrDrag: 'Click or drag image',
      addToGallery: 'Add Images to Gallery',
      addReview: 'Add New Review',
      editReview: 'Edit Review',
      reviewerName: 'Name',
      reviewerRole: 'Role / Relationship',
      reviewerRolePlaceholder: 'e.g.: Colleague, Client, Friend',
      reviewContent: 'Review content',
      rating: 'Rating',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('lwr_language');
    return saved || 'ro';
  });

  useEffect(() => {
    localStorage.setItem('lwr_language', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ro' ? 'en' : 'ro');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
