import React from 'react';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const whatsappNumber = '2348060000960';
  const phoneNumber = '+2348060000960';
  const email = 'hello@errandmama.ng';

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EM</span>
              </div>
              <span className="text-xl font-bold">Errand Mama</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Making life easier for busy professionals in Lagos and Nigerians in the diaspora, 
              one errand at a time. Reliable, professional, and trusted errand services across Lagos.
            </p>
            <div className="flex items-center space-x-1 text-gray-400 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Lagos, Nigeria</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Sharp Sharp Service</li>
              <li>Market Runs</li>
              <li>General Errands</li>
              <li>Document Services</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href={`tel:${phoneNumber}`}
                  className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{phoneNumber}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">WhatsApp</span>
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${email}`}
                  className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Errand Mama. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;