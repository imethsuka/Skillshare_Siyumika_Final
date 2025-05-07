import { Link } from "react-router-dom";
import { FaSeedling, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaArrowRight } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-purple-800 to-purple-900 text-white pt-12 pb-6 relative overflow-hidden">
      {/* Decorative elements - simplified for cleaner look */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-purple-500 opacity-5"></div>
      <div className="absolute top-20 -right-16 w-32 h-32 rounded-full bg-purple-400 opacity-5"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Brand column - now with more space */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-4">
              <FaSeedling className="text-purple-300 text-2xl mr-2" />
              <h3 className="text-2xl font-bold text-white">SkillShare</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Track your learning journey, share your knowledge, and connect with a community of passionate learners to achieve your goals.
            </p>
          </div>
          
          {/* Navigation links - simplified into two columns */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-white mb-4">Learn</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/learning-paths" className="text-gray-300 hover:text-white text-sm flex items-center transition-all duration-200">
                  <span className="h-1 w-0 bg-purple-400 mr-0 transition-all group-hover:w-2 group-hover:mr-2"></span>Learning Paths
                </Link>
              </li>
              <li>
                <Link to="/posts" className="text-gray-300 hover:text-white text-sm flex items-center transition-all duration-200">
                  <span className="h-1 w-0 bg-purple-400 mr-0 transition-all group-hover:w-2 group-hover:mr-2"></span>Community Posts
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-white mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white text-sm flex items-center transition-all duration-200">
                  <span className="h-1 w-0 bg-purple-400 mr-0 transition-all group-hover:w-2 group-hover:mr-2"></span>About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm flex items-center transition-all duration-200">
                  <span className="h-1 w-0 bg-purple-400 mr-0 transition-all group-hover:w-2 group-hover:mr-2"></span>Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter and social - clean design */}
          <div className="md:col-span-4">
            <h4 className="text-lg font-medium text-white mb-4">Stay Connected</h4>
            
            {/* Social icons with improved spacing */}
            <div className="flex gap-3 mb-6">
              <a href="#" className="w-9 h-9 rounded-full bg-purple-700 hover:bg-purple-600 flex items-center justify-center transition-all duration-200">
                <FaFacebook className="text-white text-sm" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-purple-700 hover:bg-purple-600 flex items-center justify-center transition-all duration-200">
                <FaTwitter className="text-white text-sm" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-purple-700 hover:bg-purple-600 flex items-center justify-center transition-all duration-200">
                <FaInstagram className="text-white text-sm" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-purple-700 hover:bg-purple-600 flex items-center justify-center transition-all duration-200">
                <FaYoutube className="text-white text-sm" />
              </a>
            </div>
            
            {/* Simplified newsletter form */}
            <div>
              <p className="text-sm text-gray-300 mb-2">Subscribe to our newsletter</p>
              <div className="flex">
                <input 
                  type="email" 
                  className="bg-purple-700/50 border border-purple-600 rounded-l-md w-full py-2 px-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400" 
                  placeholder="Enter your email" 
                />
                <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 rounded-r-md flex items-center justify-center transition-colors" type="button">
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Clean divider line */}
        <div className="h-px bg-purple-700 my-6"></div>
        
        {/* Copyright and legal - simplified */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div>
            &copy; {currentYear} SkillShare. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;