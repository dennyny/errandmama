import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, Mail, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useErrand } from '../context/ErrandContext';
import { formatNaira } from '../utils/currency';

const AdminRequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { admin, getRequestById, updateRequestStatus } = useErrand();
  const [request, setRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!admin.isAuthenticated) {
      navigate('/admin');
      return;
    }

    if (id) {
      const foundRequest = getRequestById(id);
      if (foundRequest) {
        setRequest(foundRequest);
        setAdminNotes(foundRequest.adminNotes || '');
      }
    }
  }, [id, admin.isAuthenticated, navigate, getRequestById]);

  if (!admin.isAuthenticated || !request) {
    return null;
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateRequestStatus(request.id, newStatus as any, adminNotes);
    setRequest(prev => ({ ...prev, status: newStatus, adminNotes }));
    setIsSaving(false);
  };

  const handleNotesUpdate = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateRequestStatus(request.id, request.status, adminNotes);
    setRequest(prev => ({ ...prev, adminNotes }));
    setIsSaving(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EM</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Errand Mama</span>
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600">Request Details</span>
            </div>
            
            <Link
              to="/admin/dashboard"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Request Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {request.errandTitle}
                  </h1>
                  <p className="text-gray-600">Request ID: {request.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {request.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium">{request.submissionDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium">{request.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Service Fee</p>
                    <p className="font-medium">{formatNaira(request.price)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 mb-4">{request.description}</p>
                
                {request.specialInstructions && (
                  <>
                    <h4 className="font-medium text-gray-900 mb-2">Special Instructions</h4>
                    <p className="text-gray-700 mb-4">{request.specialInstructions}</p>
                  </>
                )}
                
                {request.budget && (
                  <>
                    <h4 className="font-medium text-gray-900 mb-2">Budget for Purchases</h4>
                    <p className="text-gray-700">{request.budget}</p>
                  </>
                )}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Add notes about this request..."
              />
              <button
                onClick={handleNotesUpdate}
                disabled={isSaving}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'Saving...' : 'Update Notes'}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-medium">{request.customerName}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Phone</p>
                    <a 
                      href={`tel:${request.phoneNumber}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {request.phoneNumber}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <a 
                      href={`mailto:${request.email}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {request.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{request.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="flex flex-col space-y-2">
                  <a
                    href={`tel:${request.phoneNumber}`}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Customer</span>
                  </a>
                  <a
                    href={`https://wa.me/${request.phoneNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
              <div className="space-y-3">
                {['new', 'assigned', 'in-progress', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={isSaving || request.status === status}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                      request.status === status
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    } disabled:opacity-50`}
                  >
                    {status.replace('-', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Service Type</p>
                  <p className="font-medium capitalize">{request.serviceType.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service Fee</p>
                  <p className="font-medium">{formatNaira(request.price)}</p>
                </div>
                {request.preferredDate && (
                  <div>
                    <p className="text-sm text-gray-500">Preferred Date</p>
                    <p className="font-medium">{request.preferredDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRequestDetails;