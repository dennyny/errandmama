import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import AuthModal from '../components/AuthModal';
import { serviceTiers } from '../data/services';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useErrand } from '../context/ErrandContext';

const ServicesPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const { user, loginUser, signupUser } = useErrand();
  const navigate = useNavigate();

  const handleAuthRequired = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setShowAuthModal(true);
  };

  // Navigate to order page when user becomes authenticated
  React.useEffect(() => {
    if (user.isAuthenticated && showAuthModal && selectedServiceId) {
      setShowAuthModal(false);
      navigate(`/order/${selectedServiceId}`);
      setSelectedServiceId('');
    }
  }, [user.isAuthenticated, showAuthModal, selectedServiceId, navigate]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Service Level
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Select the service tier that best matches your timeline and requirements. 
            All services include professional execution and regular updates.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceTiers.map((service) => (
            <ServiceCard key={service.id} service={service} onAuthRequired={handleAuthRequired} />
          ))}
        </div>
        
        <div className="mt-16 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Select Service</h3>
              <p className="text-gray-600">Choose the service tier that matches your timeline</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Submit Details</h3>
              <p className="text-gray-600">Fill out the form with your errand requirements</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Relax & Track</h3>
              <p className="text-gray-600">We handle everything and keep you updated</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      <AuthModal 
         isOpen={showAuthModal}
         onClose={() => {
           setShowAuthModal(false);
           setSelectedServiceId('');
         }}
         initialMode="login"
         onLogin={async (email: string, password: string) => {
           const success = await loginUser(email, password);
           if (!success) {
             return false;
           }
           return true;
         }}
         onSignup={async (userData: any) => {
           const success = await signupUser(userData);
           if (!success) {
             return false;
           }
           return true;
         }}
       />
    </div>
  );
};

export default ServicesPage;