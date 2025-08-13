import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, User, LogOut } from 'lucide-react';
import { useErrand } from '../context/ErrandContext';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const whatsappNumber = '2348060000960';
  const phoneNumber = '+2348060000960';
  const { user, logoutUser, loginUser, signupUser } = useErrand();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialMode, setInitialMode] = useState<'login' | 'signup'>('login');
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EM</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Errand Mama</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-gray-700 hover:text-green-600 transition-colors">
              Services
            </Link>
            <Link to="/track" className="text-gray-700 hover:text-green-600 transition-colors">
              Track Order
            </Link>
            <div className="flex items-center space-x-4">
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">{phoneNumber}</span>
              </a>
              <a 
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">WhatsApp</span>
              </a>
              
              {user.isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.firstName}</span>
                  </div>
                  <button
                    onClick={logoutUser}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                     onClick={() => {
                       setInitialMode('login');
                       setShowAuthModal(true);
                     }}
                     className="text-green-600 hover:text-green-700 px-3 py-2 text-sm font-medium transition-colors"
                   >
                     Sign In
                   </button>
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setInitialMode('signup');
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </nav>

          <div className="md:hidden">
            <a 
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={initialMode}
        onLogin={async (email: string, password: string) => {
          const success = await loginUser(email, password);
          if (success) {
            setShowAuthModal(false);
          }
          return success;
        }}
        onSignup={async (userData: any) => {
          const success = await signupUser(userData);
          if (success) {
            setShowAuthModal(false);
          }
          return success;
        }}
      />
    </header>
  );
};

export default Header