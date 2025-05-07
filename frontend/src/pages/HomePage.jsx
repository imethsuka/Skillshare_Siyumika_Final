// src/pages/HomePage.js
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { FaSeedling, FaUsers, FaMedal, FaLeaf, FaSearch, FaStar, FaCertificate, FaLaptop } from 'react-icons/fa';
import { useState, useEffect } from 'react';

// Import the plant.png image we know exists in the project
import plantIcon from '../images/progress/plant.png';
import leafIcon from '../images/progress/leaf.png';
import badgeIcon from '../images/progress/badge.png';

function HomePage() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Images for course cards - using relative URLs that will be fetched from public folder
  const courseImages = {
    webDev: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
    dataAnalytics: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    careerGrowth: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
  };

  // Instructor photos - using placeholder images
  const instructorImages = [
    'https://randomuser.me/api/portraits/women/79.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
  ];

  // Testimonial user photos
  const testimonialImages = [
    'https://randomuser.me/api/portraits/men/86.jpg',
    'https://randomuser.me/api/portraits/women/65.jpg',
  ];

  // Popular categories in a Udemy-like interface
  const popularCategories = [
    { name: "Growth Skills", icon: <FaSeedling className="text-green-600" />, path: "/plans" },
    { name: "Community Learning", icon: <FaUsers className="text-blue-600" />, path: "/posts" },
    { name: "Certification Paths", icon: <FaCertificate className="text-amber-600" />, path: "/badges" },
  ];

  // Featured instructors 
  const featuredInstructors = [
    { name: "Maria Garcia", role: "Learning Expert", students: 2453, courses: 12, rating: 4.8 },
    { name: "John Peterson", role: "Growth Specialist", students: 1879, courses: 8, rating: 4.7 },
    { name: "Sarah Miller", role: "Skill Mentor", students: 3120, courses: 15, rating: 4.9 }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section - Course Search with Background Image */}
      <div className="relative rounded-xl shadow-lg overflow-hidden mb-12">
        {/* Overlay gradient on top of background image */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700/90 to-purple-900/90 z-10"></div>
        
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)`,
            filter: 'brightness(0.7)'
          }}
        ></div>

        {/* Content */}
        <div className="relative z-20 p-8 md:p-12 lg:px-16 lg:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
              Grow Your Skills with <span className="text-yellow-300">Expert Guidance</span>
            </h1>
            <p className="text-xl text-white mb-8 drop-shadow">
              Master new skills, track your progress, and connect with a community of learners passionate about growth and development.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <input 
                type="text"
                placeholder="What skill do you want to develop today?"
                className="w-full px-6 py-4 rounded-full shadow-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Link to={`/plans?search=${searchQuery}`} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full">
                <FaSearch />
              </Link>
            </div>

            {currentUser ? (
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/plans" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg shadow-md transform hover:-translate-y-1 transition-all duration-200 flex items-center font-medium">
                  <FaSeedling className="mr-2" /> Browse Learning Plans
                </Link>
                <Link to="/posts" className="bg-white hover:bg-gray-100 text-purple-700 px-8 py-3 rounded-lg shadow-md transform hover:-translate-y-1 transition-all duration-200 flex items-center font-medium">
                  <FaUsers className="mr-2" /> Explore Community
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg shadow-md transform hover:-translate-y-1 transition-all duration-200 flex items-center font-medium">
                  <FaUsers className="mr-2" /> Start Learning Today
                </Link>
                <Link to="/login" className="bg-white hover:bg-gray-100 text-purple-700 px-8 py-3 rounded-lg shadow-md transform hover:-translate-y-1 transition-all duration-200 flex items-center font-medium">
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 z-10">
          <img src={leafIcon} alt="Leaf" className="w-24 h-24 opacity-50 transform -rotate-12" />
        </div>
        <div className="absolute top-0 right-0 z-10">
          <img src={leafIcon} alt="Leaf" className="w-16 h-16 opacity-30 transform rotate-45" />
        </div>
      </div>
      
      {/* Categories Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaLaptop className="mr-3 text-purple-600" /> Popular Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularCategories.map((category, index) => (
            <Link to={category.path} key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-6 flex items-center relative overflow-hidden group">
              {/* Category background pattern */}
              <div className="absolute inset-0 bg-opacity-5 bg-purple-500 group-hover:bg-opacity-10 transition-all">
                <div className="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4">
                  <img src={plantIcon} alt="" className="w-24 h-24 opacity-10" />
                </div>
              </div>
              
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 relative z-10">
                {category.icon}
              </div>
              <h3 className="text-xl font-medium text-gray-800 relative z-10">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Featured Learning Paths */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaSeedling className="mr-3 text-purple-600" /> Featured Learning Paths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Course Card 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="h-48 relative">
              <img 
                src={courseImages.webDev} 
                alt="Web Development" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                BESTSELLER
              </div>
            </div>
            <div className="p-6 flex-grow">
              <h3 className="text-lg font-bold mb-2">Web Development Fundamentals</h3>
              <p className="text-gray-600 text-sm mb-3">Learn the core skills needed for modern web development</p>
              <div className="flex items-center text-sm text-amber-500 mb-3">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                <span className="text-gray-600 ml-1">5.0 (2,453 students)</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">12 milestones • All levels</div>
              <Link to="/plans" className="block text-center bg-purple-100 text-purple-700 hover:bg-purple-200 py-2 rounded-md font-medium transition">
                Explore Path
              </Link>
            </div>
          </div>

          {/* Course Card 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="h-48 relative">
              <img 
                src={courseImages.dataAnalytics} 
                alt="Data Analytics" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 bg-purple-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                POPULAR
              </div>
            </div>
            <div className="p-6 flex-grow">
              <h3 className="text-lg font-bold mb-2">Data Analytics Mastery</h3>
              <p className="text-gray-600 text-sm mb-3">Learn to analyze and visualize data for better decisions</p>
              <div className="flex items-center text-sm text-amber-500 mb-3">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                <span className="text-gray-600 ml-1">4.8 (1,879 students)</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">10 milestones • Intermediate</div>
              <Link to="/plans" className="block text-center bg-purple-100 text-purple-700 hover:bg-purple-200 py-2 rounded-md font-medium transition">
                Explore Path
              </Link>
            </div>
          </div>

          {/* Course Card 3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="h-48 relative">
              <img 
                src={courseImages.careerGrowth} 
                alt="Career Growth" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                NEW
              </div>
            </div>
            <div className="p-6 flex-grow">
              <h3 className="text-lg font-bold mb-2">Career Growth Strategies</h3>
              <p className="text-gray-600 text-sm mb-3">Master the skills to advance your professional career</p>
              <div className="flex items-center text-sm text-amber-500 mb-3">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                <span className="text-gray-600 ml-1">4.9 (873 students)</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">8 milestones • All levels</div>
              <Link to="/plans" className="block text-center bg-purple-100 text-purple-700 hover:bg-purple-200 py-2 rounded-md font-medium transition">
                Explore Path
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Instructors Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaUsers className="mr-3 text-purple-600" /> Our Expert Mentors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredInstructors.map((instructor, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="p-6 text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-purple-100">
                  <img 
                    src={instructorImages[index]} 
                    alt={instructor.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold mb-1">{instructor.name}</h3>
                <p className="text-purple-600 text-sm mb-3">{instructor.role}</p>
                <div className="flex items-center justify-center text-amber-500 mb-2">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  <span className="text-gray-600 ml-1">{instructor.rating}</span>
                </div>
                <p className="text-gray-600 text-sm">
                  {instructor.students.toLocaleString()} students • {instructor.courses} courses
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Testimonial Section with Photos */}
      <div className="mb-16 bg-gray-50 rounded-xl p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-5 left-5 opacity-10">
          <img src={badgeIcon} alt="" className="h-32 w-32" />
        </div>
        <div className="absolute bottom-5 right-5 opacity-10">
          <img src={leafIcon} alt="" className="h-24 w-24 transform rotate-45" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center relative z-10">
          What Our Learners Say
        </h2>
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center text-amber-500 mb-2">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p className="text-gray-700 mb-4">"The structure of the learning paths and the progress tracking has been a game changer for my skill development. I can now see my growth visually!"</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img src={testimonialImages[0]} alt="James Davis" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium">James Davis</p>
                <p className="text-sm text-gray-500">Web Developer</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center text-amber-500 mb-2">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p className="text-gray-700 mb-4">"The community features really help me stay accountable. Being able to share my progress and get feedback has accelerated my learning journey."</p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img src={testimonialImages[1]} alt="Aisha Martinez" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium">Aisha Martinez</p>
                <p className="text-sm text-gray-500">UX Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section with Background Image */}
      <div className="relative rounded-xl overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)`,
            filter: 'brightness(0.4)'
          }}
        ></div>
        
        {/* Purple gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700/80 to-purple-900/80"></div>
        
        {/* Content */}
        <div className="relative z-10 p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">Join thousands of learners who are developing their skills, tracking their progress, and achieving their goals.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg shadow-md transform hover:-translate-y-1 transition-all duration-200 flex items-center font-medium">
              <FaMedal className="mr-2" /> Create Free Account
            </Link>
            <Link to="/plans" className="bg-white hover:bg-gray-100 text-purple-700 px-8 py-3 rounded-lg shadow-md transform hover:-translate-y-1 transition-all duration-200 flex items-center font-medium">
              <FaSeedling className="mr-2" /> Explore Learning Paths
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;