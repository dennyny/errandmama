import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShoppingBasket, ListChecks, ArrowRight } from 'lucide-react';
import { ServiceTier } from '../types';
import { formatNaira } from '../utils/currency';

interface ServiceCardProps {
  service: ServiceTier;
}

const iconMap = {
  zap: Zap,
  'shopping-basket': ShoppingBasket,
  'list-checks': ListChecks,
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const IconComponent = iconMap[service.icon as keyof typeof iconMap];

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{formatNaira(service.price)}</div>
            <div className="text-sm text-gray-500">{service.timeline}</div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Examples:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {service.examples.map((example, index) => (
              <li key={index} className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                {example}
              </li>
            ))}
          </ul>
        </div>
        
        <Link
          to={`/order/${service.id}`}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center group"
        >
          Select This Service
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;