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
  
  const [loading, setLoading] = useState(true); // Start with true to show loading
  const [verifying, setVerifying] = useState(true); // Separate state for token verification
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);

  // Verify token and get candidate info - ONLY works with valid token from email
  React.useEffect(() => {
    // If no token in URL, show error immediately
    if (!token || token.trim() === '') {
      setError('Invalid upload link. This page can only be accessed via the link sent to your email.');
      setVerifying(false);
      setLoading(false);
      return;
    }

    console.log('=== FRONTEND TOKEN DEBUG ===');
    console.log('Extracted token:', token);
    console.log('Current URL:', window.location.href);
    
    const verifyToken = async () => {
      setVerifying(true);
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`https://api.100acress.com/career/verify-upload-token/${token}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setCandidateInfo(data.data);
          setError('');
        } else {
          setError(data.message || 'Invalid or expired upload link. Please use the link sent to your email or contact HR for a new link.');
        }
      } catch (err) {
        console.error('Token verification error:', err);
        setError('Failed to verify upload link. Please ensure you are using the link sent to your email. If the problem persists, contact HR.');
      } finally {
        setVerifying(false);
        setLoading(false);
      }
    };

    verifyToken();
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

      const response = await fetch(`https://api.100acress.com/career/upload-documents/${token}`, {
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

  // Show loading state while verifying token
  if (verifying || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Upload Link</h2>
          <p className="text-gray-600">Please wait while we verify your secure upload link...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid or missing
  if (error && !candidateInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium mb-2">⚠️ Important:</p>
            <p className="text-sm text-yellow-700">
              This page can only be accessed through the secure link sent to your email. 
              Please check your email inbox for the upload link.
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-4">If you need a new link, please contact HR.</p>
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
              'Please wait...'
            }
          </p>
          {candidateInfo && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="text-green-600 mr-2" size={20} />
              <span className="text-sm text-green-800 font-medium">Secure link verified ✓</span>
            </div>
          )}
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

        {/* Candidate Information */}
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Onboarding Details</h2>
          
          {candidateInfo ? (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-gray-900">{candidateInfo.candidateName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Position:</span>
                    <p className="text-gray-900">{candidateInfo.position}</p>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              {candidateInfo.jobDetails && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Department:</span>
                      <p className="text-gray-900">{candidateInfo.jobDetails.department}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Employment Type:</span>
                      <p className="text-gray-900">{candidateInfo.jobDetails.employmentType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <p className="text-gray-900">{candidateInfo.jobDetails.location}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Reporting Manager:</span>
                      <p className="text-gray-900">{candidateInfo.jobDetails.reportingManager}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Joining Date:</span>
                      <p className="text-gray-900">{candidateInfo.jobDetails.joiningDate}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Work Schedule:</span>
                      <p className="text-gray-900">{candidateInfo.jobDetails.workSchedule}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Probation Period:</span>
                      <p className="text-gray-900">{candidateInfo.jobDetails.probationPeriod}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Salary:</span>
                      <p className="text-gray-900">{candidateInfo.jobDetails.salary}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {candidateInfo.jobDetails?.responsibilities && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {candidateInfo.jobDetails.responsibilities.map((responsibility, index) => (
                      <li key={index} className="text-gray-700">{responsibility}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {candidateInfo.jobDetails?.requirements && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {candidateInfo.jobDetails.requirements.map((requirement, index) => (
                      <li key={index} className="text-gray-700">{requirement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {candidateInfo.jobDetails?.benefits && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {candidateInfo.jobDetails.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading your information...</p>
            </div>
          )}
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
