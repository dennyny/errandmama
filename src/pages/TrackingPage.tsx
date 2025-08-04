import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useErrand } from '../context/ErrandContext';
import { formatNaira } from '../utils/currency';

const TrackingPage: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { getRequestById } = useErrand();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request = getRequestById(trackingId);
    setSearchResult(request || null);
    setIsSearching(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-100';
      case 'assigned': return 'text-yellow-600 bg-yellow-100';
      case 'in-progress': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return Package;
      case 'assigned': return Clock;
      case 'in-progress': return Clock;
      case 'completed': return CheckCircle;
      default: return Package;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Errand
          </h1>
          <p className="text-gray-600">
            Enter your request ID to check the status of your errand
          </p>
        </div>
        
        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your request ID (e.g., EM001234)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !trackingId}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSearching ? (
                'Searching...'
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Track
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Search Results */}
        {searchResult && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {searchResult.errandTitle}
                  </h2>
                  <p className="text-gray-600">Request ID: {searchResult.id}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(searchResult.status)}`}>
                  {searchResult.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <span className="ml-2 font-medium">{searchResult.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Service Type:</span>
                    <span className="ml-2 font-medium capitalize">
                      {searchResult.serviceType.replace('-', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Service Fee:</span>
                    <span className="ml-2 font-medium">{formatNaira(searchResult.price)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Submitted:</span>
                    <span className="ml-2 font-medium">{searchResult.submissionDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Due Date:</span>
                    <span className="ml-2 font-medium">{searchResult.dueDate}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['new', 'assigned', 'in-progress', 'completed'].includes(searchResult.status) 
                        ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Package className={`w-4 h-4 ${
                        ['new', 'assigned', 'in-progress', 'completed'].includes(searchResult.status) 
                          ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">Request Received</div>
                      <div className="text-sm text-gray-600">{searchResult.submissionDate}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['assigned', 'in-progress', 'completed'].includes(searchResult.status) 
                        ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Clock className={`w-4 h-4 ${
                        ['assigned', 'in-progress', 'completed'].includes(searchResult.status) 
                          ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">Assigned to Agent</div>
                      <div className="text-sm text-gray-600">
                        {['assigned', 'in-progress', 'completed'].includes(searchResult.status) 
                          ? 'Completed' : 'Pending'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['in-progress', 'completed'].includes(searchResult.status) 
                        ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Clock className={`w-4 h-4 ${
                        ['in-progress', 'completed'].includes(searchResult.status) 
                          ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">In Progress</div>
                      <div className="text-sm text-gray-600">
                        {['in-progress', 'completed'].includes(searchResult.status) 
                          ? 'In progress' : 'Pending'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      searchResult.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <CheckCircle className={`w-4 h-4 ${
                        searchResult.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">Completed</div>
                      <div className="text-sm text-gray-600">
                        {searchResult.status === 'completed' ? 'Completed' : 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {searchResult.adminNotes && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Latest Update:</h4>
                <p className="text-blue-800">{searchResult.adminNotes}</p>
              </div>
            )}
          </div>
        )}
        
        {searchResult === null && trackingId && !isSearching && (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-gray-500 mb-4">
              <Package className="w-12 h-12 mx-auto mb-2" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Request Not Found
            </h3>
            <p className="text-gray-600">
              We couldn't find an errand request with ID "{trackingId}". 
              Please check the ID and try again.
            </p>
          </div>
        )}
        
        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Where do I find my request ID?
              </h3>
              <p className="text-gray-600">
                Your request ID is provided immediately after submitting your errand request 
                and is also sent to your email.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                How often is tracking updated?
              </h3>
              <p className="text-gray-600">
                We update your errand status in real-time as our agents progress through 
                the different stages of your request.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What if my errand is delayed?
              </h3>
              <p className="text-gray-600">
                If there are any delays, we'll proactively notify you via phone call or SMS 
                with an updated timeline.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I modify my request?
              </h3>
              <p className="text-gray-600">
                Contact us immediately via WhatsApp or phone to discuss modifications. 
                Changes may affect pricing and timeline.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TrackingPage;