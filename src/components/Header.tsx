import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail } from 'lucide-react';

const Header: React.FC = () => {
  const whatsappNumber = '2348060000960';
  const phoneNumber = '+2348060000960';
  
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
    </header>
  );
};

export default Header