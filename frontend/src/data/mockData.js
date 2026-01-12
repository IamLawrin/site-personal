// Mock data for portfolio - will be replaced with backend API calls

export const profileData = {
  name: "Vacaru Andrei Laurentiu",
  shortName: "Lawrin",
  title: "Electronics Student & Developer",
  age: 21,
  university: "Universitatea Politehnica București",
  faculty: "Facultatea de Transporturi - Electronică",
  bio: "Pasionat de electronică, programare și proiecte creative. Transform ideile în realitate prin circuite și cod.",
  email: "contact@lwr.ro",
  social: {
    instagram: "#",
    linkedin: "#",
    github: "#"
  }
};

export const mockProjects = [
  {
    id: "1",
    title: "Smart Home Controller",
    description: "Sistem de automatizare pentru casă bazat pe ESP32 cu interfață web și control prin aplicație mobilă.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    technologies: ["ESP32", "C++", "React", "MQTT"],
    date: "2024-12-15",
    featured: true
  },
  {
    id: "2",
    title: "LED Matrix Display",
    description: "Matrice LED 32x16 controlată prin Arduino cu animații personalizate și sincronizare audio.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    technologies: ["Arduino", "WS2812B", "Python"],
    date: "2024-10-20",
    featured: true
  },
  {
    id: "3",
    title: "Portfolio Website",
    description: "Site personal de portofoliu cu design modern și funcționalități de administrare.",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    technologies: ["React", "Node.js", "MongoDB"],
    date: "2025-01-10",
    featured: false
  },
  {
    id: "4",
    title: "Weather Station",
    description: "Stație meteo DIY cu senzori de temperatură, umiditate și presiune atmosferică.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
    technologies: ["Raspberry Pi", "Python", "InfluxDB"],
    date: "2024-08-05",
    featured: false
  }
];

export const mockReviews = [
  {
    id: "1",
    name: "Alexandru Pop",
    role: "Coleg de facultate",
    content: "Andrei este un coleg de nădejde, mereu dispus să ajute și să explice concepte complexe de electronică.",
    rating: 5,
    date: "2024-11-20"
  },
  {
    id: "2",
    name: "Maria Ionescu",
    role: "Client",
    content: "Am colaborat pentru un proiect de automatizare. Profesionist, punctual și foarte creativ în soluții.",
    rating: 5,
    date: "2024-12-01"
  },
  {
    id: "3",
    name: "Cristian Dumitrescu",
    role: "Prieten",
    content: "Îl cunosc pe Andrei de ani de zile. Dedicat, pasionat și mereu în căutarea de noi provocări tehnice.",
    rating: 5,
    date: "2025-01-05"
  }
];

export const mockGalleryImages = [
  {
    id: "1",
    title: "Circuit Board Design",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    category: "Electronics",
    date: "2024-12-10"
  },
  {
    id: "2",
    title: "Workshop Setup",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
    category: "Workspace",
    date: "2024-11-15"
  },
  {
    id: "3",
    title: "LED Project",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    category: "Projects",
    date: "2024-10-20"
  },
  {
    id: "4",
    title: "Soldering Station",
    url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop",
    category: "Workspace",
    date: "2024-09-05"
  }
];

export const mockContactMessages = [
  {
    id: "1",
    name: "Ion Popescu",
    email: "ion@example.com",
    subject: "Colaborare proiect",
    message: "Bună ziua, aș dori să discutăm despre un potențial proiect de automatizare.",
    date: "2025-01-10",
    read: false
  },
  {
    id: "2",
    name: "Ana Vasilescu",
    email: "ana@example.com",
    subject: "Întrebare tehnică",
    message: "Am văzut proiectul tău cu ESP32 și am câteva întrebări.",
    date: "2025-01-08",
    read: true
  }
];
