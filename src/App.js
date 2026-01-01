import React, { useState, useEffect } from 'react';
import { Menu, Mail, Code, Github, Linkedin } from 'lucide-react';

// Typewriter Effect Component
const TypewriterEffect = ({ text, speed = 100, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span className={className}>{displayText}<span className="animate-pulse">|</span></span>;
};

// Mock API calls
const api = {
  getProjects: async () => {
    return [
      {
        id: 1,
        title: "OSU Research Commons Library Website",
        description: "Developing and optimizing the OSU Research Library website with a team to improve user experience and navigation",
        status: "In Progress",
        tags: ["Web Development", "UX/UI", "Team Project"]
      },
      {
        id: 2,
        title: "AI Study Website",
        description: "Developed an AI-powered study website that converts video, image, and text inputs into review guides and flashcards",
        status: "Completed",
        tags: ["AI", "React", "Machine Learning"]
      },
      {
        id: 3,
        title: "GeoLocation ML Model",
        description: "Working on a machine learning model that predicts image locations by analyzing a large data set of geotagged photos using Google Maps integration",
        status: "In Progress",
        tags: ["Machine Learning", "Python", "Google Maps API"]
      },
      {
        id: 4,
        title: "Personal Portfolio Website",
        description: "Created a personal portfolio website to showcase projects and skills using React and Tailwind CSS",
        status: "Completed",
        tags: ["Web Development", "React", "Tailwind CSS"]
      }
    ];
  }
};

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [projects, setProjects] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading projects:', error);
      setLoading(false);
    }
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/30 backdrop-blur-lg z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-gray-300">
              Aniruddha Bhati
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-all hover:text-amber-400 ${
                    activeSection === section ? 'text-amber-700' : 'text-white'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {['home', 'about', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left px-4 py-2 capitalize hover:bg-white/10 rounded-lg transition-colors"
                >
                  {section}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <Code size={64} className="mx-auto text-amber-700 mb-4" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-2">
            <TypewriterEffect text="Aniruddha Bhati" speed={100} />
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-1 leading-tight">
            Scholars Computer Science & Engineering Student at The Ohio State University 
          </p>
          <p className="text-lg md:text-xl text-gray-300 mt-0 mb-8 leading-tight">
            Aspiring AI/ML Engineer | Emerging Developer | Growth Driven Learner
          </p>
          <div className="flex justify-center gap-4 flex-wrap mt-4">
            <button
              onClick={() => scrollToSection('projects')}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-900 rounded-full font-semibold hover:shadow-lg hover:shadow-amber-700/50 transition-all"
            >
              View Projects
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 border-2 border-amber-700 rounded-full font-semibold hover:bg-amber-700/10 transition-all"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-amber-500 to-amber-900 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                Hello! I'm a freshman undergraduate Scholars Computer Science and Engineering student 
                with a minor in business at The Ohio State University.
              </p>
              <p>
                I'm passionate about technology, problem-solving, and exploring how data structures 
                and algorithms shape the systems we use every day. I have a strong interest in 
                <span className="text-amber-600 font-semibold"> machine learning</span> and 
                <span className="text-amber-600 font-semibold"> generative AI</span>, and I hope to 
                pursue a career in those fields.
              </p>
              <p>
                I'm constantly learning, building projects, and expanding my skills to create 
                real-world, impactful solutions.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-amber-600">Skills & Interests</h3>
              <div className="flex flex-wrap gap-2">
                {['Machine Learning', 'AI', 'Data Structures', 'Algorithms', 'Web Development', 'React', 'Python', 'Problem Solving'].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-amber-50/20 rounded-full text-sm border border-amber-600/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-amber-500 to-amber-900 bg-clip-text text-transparent">
            Projects
          </h2>
          
          {loading ? (
            <div className="text-center text-blue-400">Loading projects...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-amber-300/50 transition-all hover:shadow-lg hover:shadow-amber-300/20 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Code size={32} className="text-amber-600" />
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'Completed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-amber-600 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto w-full text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-amber-500 to-amber-900 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <Mail size={48} className="mx-auto text-amber-700 mb-6" />
            
            <p className="text-gray-300 text-lg mb-8">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            
            <a
              href="mailto:bhati.27@buckeyemail.osu.edu"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-900 rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              <Mail size={20} />
              bhati.27@buckeyemail.osu.edu
            </a>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-gray-400 mb-4">Connect with me</p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://github.com/anibhati"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Github size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/in/aniruddha-bhati-729771377/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-400">
        <p>© 2025 Aniruddha Bhati. Built with React, Node.js, Tailwind CSS, & JSON.</p>
      </footer>
    </div>
  );
};

export default Portfolio;