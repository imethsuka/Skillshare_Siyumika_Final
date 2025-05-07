// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { 
  FaSeedling, FaUsers, FaLaptop, FaGraduationCap, 
  FaChartLine, FaSearch, FaArrowRight, FaCertificate, 
  FaLightbulb, FaBookReader, FaMedal, FaStar
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// Import images for learning progress visualization
import leafIcon from '../images/progress/leaf.png';
import badgeIcon from '../images/progress/badge.png';
import plantIcon from '../images/progress/plant.png';

function HomePage() {
  const { currentUser, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'web', name: 'Web Development', icon: <FaLaptop /> },
    { id: 'data', name: 'Data Science', icon: <FaChartLine /> },
    { id: 'design', name: 'Design', icon: <FaLightbulb /> },
    { id: 'business', name: 'Business', icon: <FaBookReader /> }
  ];

  // Featured learning paths
  const featuredPaths = [
    {
      id: 1,
      title: 'Modern Web Development',
      description: 'Master the fundamentals of modern web development with React, Node.js and MongoDB',
      level: 'Intermediate',
      duration: '8 weeks',
      students: 1245,
      milestones: 12,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
      tag: 'POPULAR'
    },
    {
      id: 2,
      title: 'Data Science Fundamentals',
      description: 'Learn to analyze data, create visualizations, and build predictive models',
      level: 'Beginner',
      duration: '10 weeks',
      students: 980,
      milestones: 15,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      tag: 'BEGINNER FRIENDLY'
    },
    {
      id: 3,
      title: 'UI/UX Design Mastery',
      description: 'Create beautiful, user-friendly interfaces that engage and delight users',
      level: 'All Levels',
      duration: '6 weeks',
      students: 750,
      milestones: 9,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      tag: 'NEW'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      text: "Skillshare completely changed my approach to learning. The structured learning paths and progress tracking keep me accountable and motivated.",
      author: "Sarah Johnson",
      role: "Frontend Developer",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 2,
      text: "I love how I can share my knowledge with others while learning from experts. The community aspect makes a huge difference in staying committed.",
      author: "Michael Chen",
      role: "Data Scientist",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    }
  ];

  // Community highlights
  const communityPosts = [
    {
      id: 1,
      title: "How I went from beginner to job-ready in 6 months",
      excerpt: "My journey learning web development and the key milestones that helped me land my first job...",
      author: "Jason Reynolds",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      comments: 24,
      likes: 156
    },
    {
      id: 2,
      title: "5 Data Science projects that impressed my interviewer",
      excerpt: "These portfolio projects demonstrate skills that employers are actively looking for...",
      author: "Priya Sharma",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      comments: 18,
      likes: 132
    }
  ];

  // Statistics
  const stats = [
    { label: 'Learning Paths', value: '500+', icon: <FaSeedling /> },
    { label: 'Active Learners', value: '10,000+', icon: <FaUsers /> },
    { label: 'Skills Mastered', value: '25,000+', icon: <FaCertificate /> }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-16 right-16 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-32 left-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-56 h-56 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Share Knowledge, <br />
              <span className="text-purple-600">Grow Together</span>
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Track your learning journey, share your knowledge, and connect with a community 
              of passionate learners to achieve your goals.
            </motion.p>

            <motion.div 
              className="relative max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <input
                type="text"
                placeholder="What skill would you like to learn today?"
                className="w-full px-6 py-4 rounded-full shadow-lg border border-purple-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-full hover:shadow-lg transition-all">
                <FaSearch />
              </button>
            </motion.div>

            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {isAuthenticated ? (
                <>
                  <Link to="/learning-paths" className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                    <FaSeedling className="mr-2" />
                    Explore Learning Paths
                  </Link>
                  <Link to="/posts" className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-purple-700 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                    <FaUsers className="mr-2" />
                    Join Discussions
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                    <FaGraduationCap className="mr-2" />
                    Start Learning for Free
                  </Link>
                  <Link to="/login" className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-purple-700 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                    Already a Member? Log In
                  </Link>
                </>
              )}
            </motion.div>
            
            {/* Floating elements */}
            <div className="hidden md:block">
              <motion.img 
                src={leafIcon} 
                alt="Leaf" 
                className="absolute top-32 right-10 w-20 h-20 opacity-40"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.img 
                src={badgeIcon} 
                alt="Badge" 
                className="absolute bottom-12 left-10 w-16 h-16 opacity-30"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose Skillshare?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers unique features designed to optimize your learning experience
              and help you achieve your goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-purple-50 rounded-xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4 shadow-md">
                <FaSeedling className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Structured Learning Paths</h3>
              <p className="text-gray-600">
                Follow step-by-step learning paths created by experts to ensure you build skills in the right order.
              </p>
            </motion.div>

            <motion.div 
              className="bg-purple-50 rounded-xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4 shadow-md">
                <FaChartLine className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Visual Progress Tracking</h3>
              <p className="text-gray-600">
                See your progress visually with milestone tracking and achievement badges that keep you motivated.
              </p>
            </motion.div>

            <motion.div 
              className="bg-purple-50 rounded-xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg w-12 h-12 flex items-center justify-center mb-4 shadow-md">
                <FaUsers className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Supportive Community</h3>
              <p className="text-gray-600">
                Join a thriving community of learners who share knowledge, experiences, and support each other.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Learning Paths */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Featured Learning Paths
              </h2>
              <p className="text-gray-600">
                Explore our most popular and highly-rated learning pathways
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-purple-100'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredPaths.map(path => (
              <motion.div 
                key={path.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                variants={itemVariant}
              >
                <div className="h-48 relative">
                  <img 
                    src={path.image}
                    alt={path.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  {path.tag && (
                    <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-md text-xs font-medium">
                      {path.tag}
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
                    {path.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {path.description}
                  </p>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex text-amber-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(path.rating) ? "text-amber-400" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {path.rating} ({path.students} students)
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <FaGraduationCap className="mr-1 text-purple-500" /> 
                      {path.level}
                    </span>
                    <span className="flex items-center">
                      <FaSeedling className="mr-1 text-purple-500" /> 
                      {path.milestones} milestones
                    </span>
                  </div>
                </div>
                
                <div className="px-6 pb-6">
                  <Link 
                    to={`/learning-paths/${path.id}`}
                    className="block w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-center font-medium transition-colors"
                  >
                    View Path
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-10">
            <Link 
              to="/learning-paths"
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-md"
            >
              Explore All Learning Paths
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-purple-700 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                <p className="text-purple-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Progress Visualization */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10">
            <img src={leafIcon} alt="" className="w-32 h-32 opacity-50" />
          </div>
          <div className="absolute bottom-10 left-10">
            <img src={badgeIcon} alt="" className="w-40 h-40 opacity-60" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Watch Your Growth Bloom
              </h2>
              <p className="text-gray-600 mb-6">
                Our unique visual progress tracking helps you see your learning journey unfold. 
                As you complete milestones, your growth is represented by a flourishing plant 
                that grows with your knowledge.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <FaSeedling className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Milestone Tracking</h3>
                    <p className="text-gray-600 text-sm">
                      Each completed milestone brings you closer to your learning goals
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-3">
                    <FaMedal className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Achievement Badges</h3>
                    <p className="text-gray-600 text-sm">
                      Earn badges for completing learning paths and special challenges
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <FaChartLine className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Progress Analytics</h3>
                    <p className="text-gray-600 text-sm">
                      Track your learning speed, consistency, and areas for improvement
                    </p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8">
                <Link 
                  to={isAuthenticated ? "/learning-progress" : "/register"}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-md"
                >
                  {isAuthenticated ? 'View Your Progress' : 'Start Your Journey'}
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="bg-purple-50 rounded-2xl p-8 relative">
                <div className="w-full h-64 relative">
                  <img 
                    src={plantIcon} 
                    alt="Growth Visualization" 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-56 object-contain z-20"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-amber-100 to-transparent z-10 rounded-b-lg"></div>
                </div>
                
                <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">Your Growth</h4>
                    <span className="text-sm text-purple-600 font-medium">75% Complete</span>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <span>9 of 12 Milestones Completed</span>
                    <Link to="/learning-paths" className="text-purple-600 hover:text-purple-700 font-medium">
                      Continue Learning
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Community & Testimonials */}
      <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Join Our Learning Community
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with fellow learners, share your insights, and get inspired by success stories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Community Content */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaUsers className="mr-2 text-purple-600" /> Popular Community Posts
              </h3>
              
              <div className="space-y-6">
                {communityPosts.map(post => (
                  <div 
                    key={post.id}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
                  >
                    <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                      {post.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img 
                          src={post.avatar}
                          alt={post.author}
                          className="w-8 h-8 rounded-full mr-2 object-cover"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {post.author}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <FaStar className="mr-1" />
                          {post.likes}
                        </span>
                        <span className="flex items-center">
                          <FaUsers className="mr-1" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  to="/posts"
                  className="inline-flex items-center px-5 py-2.5 bg-white border border-purple-200 hover:bg-purple-50 text-purple-700 rounded-lg transition-colors"
                >
                  View All Community Posts
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
            
            {/* Testimonials */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaStar className="mr-2 text-amber-500" /> Learner Testimonials
              </h3>
              
              <div className="space-y-4">
                {testimonials.map(testimonial => (
                  <motion.div 
                    key={testimonial.id}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex text-amber-400 mb-3">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                    <p className="text-gray-600 text-sm mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center">
                      <img 
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {testimonial.author}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-700 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are developing their skills, tracking their progress, 
            and connecting with like-minded individuals.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to={isAuthenticated ? "/learning-paths" : "/register"}
              className="px-8 py-3 bg-white text-purple-700 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              {isAuthenticated ? 'Explore Learning Paths' : 'Create Free Account'}
            </Link>
            
            {!isAuthenticated && (
              <Link 
                to="/login"
                className="px-8 py-3 bg-purple-600 text-white border border-purple-400 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default HomePage;