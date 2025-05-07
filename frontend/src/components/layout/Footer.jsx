import { Link } from "react-router-dom";
import { FaSeedling, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaArrowRight } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white pt-16 pb-8 mt-10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-300 via-purple-500 to-purple-300"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-purple-500 opacity-10 -mb-8 -ml-8"></div>
      <div className="absolute top-12 right-12 w-24 h-24 rounded-full bg-purple-400 opacity-5"></div>
      <div className="absolute bottom-24 right-32 w-12 h-12 rounded-full bg-purple-300 opacity-10"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div>
            <div className="flex items-center mb-4">
              <FaSeedling className="text-purple-300 text-2xl mr-2" />
              <h3 className="text-2xl font-bold text-white">SkillShare</h3>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Track your learning plans, share your knowledge, and grow together with our community of skill-building enthusiasts.
            </p>
          </div>
          
          {/* Learn column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-5 pb-2 border-b border-purple-600">Learn</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/planting-plans" className="text-gray-300 hover:text-white text-sm transition duration-300 flex items-center">
                  <span className="h-1 w-2 bg-purple-400 mr-2"></span>Learning Plans
                </Link>
              </li>
              <li>
                <Link to="/posts" className="text-gray-300 hover:text-white text-sm transition duration-300 flex items-center">
                  <span className="h-1 w-2 bg-purple-400 mr-2"></span>Community Posts
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Community column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-5 pb-2 border-b border-purple-600">Community</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white text-sm transition duration-300 flex items-center">
                  <span className="h-1 w-2 bg-purple-400 mr-2"></span>About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm transition duration-300 flex items-center">
                  <span className="h-1 w-2 bg-purple-400 mr-2"></span>Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white text-sm transition duration-300 flex items-center">
                  <span className="h-1 w-2 bg-purple-400 mr-2"></span>Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Connect column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-5 pb-2 border-b border-purple-600">Connect With Us</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-purple-800 hover:bg-purple-700 flex items-center justify-center transition duration-300">
                <FaFacebook className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-purple-800 hover:bg-purple-700 flex items-center justify-center transition duration-300">
                <FaTwitter className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-purple-800 hover:bg-purple-700 flex items-center justify-center transition duration-300">
                <FaInstagram className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-purple-800 hover:bg-purple-700 flex items-center justify-center transition duration-300">
                <FaYoutube className="text-white" />
              </a>
            </div>
            
            <div className="mb-5">
              <p className="text-sm text-gray-300 mb-2">Subscribe to our newsletter</p>
              <div className="flex">
                <div className="relative flex-grow">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    className="bg-purple-800 border border-purple-700 rounded-l-md w-full py-2 pl-10 pr-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500" 
                    placeholder="Email address" 
                  />
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 rounded-r-md flex items-center justify-center transition duration-300" type="button">
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-purple-600 to-transparent my-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div>
            &copy; {currentYear} SkillShare. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex gap-6">
            <Link to="/terms" className="hover:text-white transition duration-300">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition duration-300">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;