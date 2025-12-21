import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Upload, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const CandidateDocumentUpload = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    panFile: null,
    aadhaarFile: null,
    photoFile: null,
    marksheetFile: null,
    otherFile1: null,
    otherFile2: null,
    joiningDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);

  // Verify token and get candidate info
  React.useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/onboarding/verify-upload-token/${token}`);
        const data = await response.json();
        
        if (data.success) {
          setCandidateInfo(data.data);
        } else {
          setError('Invalid or expired upload link. Please contact HR.');
        }
      } catch (err) {
        setError('Failed to verify upload link. Please try again.');
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
    // Clear error when user selects a file
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate required files
    const requiredFiles = ['panFile', 'aadhaarFile', 'photoFile'];
    const missingFiles = requiredFiles.filter(field => !formData[field]);
    
    if (missingFiles.length > 0) {
      setError('Please upload all required documents (PAN, Aadhaar, and Photo).');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add files
      Object.keys(formData).forEach(key => {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`/api/onboarding/upload-documents/${token}`, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to upload documents. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !candidateInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Link</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Please contact HR for a new upload link.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Documents Uploaded Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for submitting your documents. Our HR team will review them and contact you soon.
          </p>
          {formData.joiningDate && (
            <p className="text-sm text-blue-600 mb-4">
              Your proposed joining date: {new Date(formData.joiningDate).toLocaleDateString()}
            </p>
          )}
          <p className="text-sm text-gray-500">You can now close this window.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <FileText className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Upload Portal</h1>
          <p className="text-gray-600">
            {candidateInfo ? 
              `Hello ${candidateInfo.candidateName}, please upload your required documents for onboarding.` :
              'Loading your information...'
            }
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8">
          {candidateInfo && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Onboarding Details</h3>
              <p className="text-sm text-blue-800">
                <strong>Position:</strong> {candidateInfo.position || 'Not specified'}<br />
                <strong>Department:</strong> {candidateInfo.department || 'Not specified'}<br />
                <strong>Current Stage:</strong> Documentation Verification
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required Documents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PAN Card */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Card <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('panFile', e.target.files[0])}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                    />
                    {formData.panFile && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <CheckCircle size={16} className="mr-1" />
                        {formData.panFile.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Aadhaar Card */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Card <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('aadhaarFile', e.target.files[0])}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                    />
                    {formData.aadhaarFile && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <CheckCircle size={16} className="mr-1" />
                        {formData.aadhaarFile.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Photograph */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recent Photograph <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('photoFile', e.target.files[0])}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required
                    />
                    {formData.photoFile && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <CheckCircle size={16} className="mr-1" />
                        {formData.photoFile.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Marksheet/Degree */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marksheet/Degree Certificate
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('marksheetFile', e.target.files[0])}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.marksheetFile && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <CheckCircle size={16} className="mr-1" />
                        {formData.marksheetFile.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Documents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Documents (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Other Document 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Document 1
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleFileChange('otherFile1', e.target.files[0])}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.otherFile1 && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <CheckCircle size={16} className="mr-1" />
                        {formData.otherFile1.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Document 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Document 2
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleFileChange('otherFile2', e.target.files[0])}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.otherFile2 && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <CheckCircle size={16} className="mr-1" />
                        {formData.otherFile2.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proposed Joining Date (Optional)
              </label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData(prev => ({ ...prev, joiningDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500 mt-1">
                If you have a preferred joining date, please specify it here.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle size={20} className="mr-2" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} className="mr-2" />
                    Upload Documents
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Instructions</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              All documents should be clear and readable. Preferred formats: PDF, JPG, PNG
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              PAN and Aadhaar cards are mandatory for verification
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Photograph should be recent and professional (passport size preferred)
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Maximum file size: 5MB per document
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Make sure all information is clearly visible without any blur
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CandidateDocumentUpload;
