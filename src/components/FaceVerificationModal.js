import React, { useState } from 'react';
import Webcam from "react-webcam";
import { CheckCircle, XCircle } from "lucide-react";

const FaceVerificationModal = ({ webcamRef, handleFaceVerified, handleClose, loadingFace, faceDetected }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false); // New state for payment success

  const handleVerify = async () => {
    if (!faceDetected) {
      setErrorMessage('No face detected. Please adjust your position.');
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    setIsVerifying(true);
    try {
      const result = await handleFaceVerified();
      if (result?.error) {
        setErrorMessage(result.error);
        setShowError(true);
        setTimeout(() => setShowError(false), 2000);
      } else {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setShowPaymentSuccess(true); // Show payment success message
          setTimeout(() => {
            setShowPaymentSuccess(false);
            handleClose(); // Close the modal after payment success message
          }, 2000); // Display payment success message for 2 seconds
        }, 2000); // Display verification success for 2 seconds
      }
    } catch (error) {
      setErrorMessage('Verification failed. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Face Verification</h2>
        </div>

        <div className="p-6">
          <div className="relative">
            <Webcam 
              ref={webcamRef} 
              className="w-full rounded-lg shadow-md border border-gray-200" 
            />
            {faceDetected ? (
              <div className="absolute bottom-2 right-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                <CheckCircle size={16} className="mr-1" />
                Face Detected
              </div>
            ) : (
              <div className="absolute bottom-2 right-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                <XCircle size={16} className="mr-1" />
                No Face Detected
              </div>
            )}

            {showSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg">
                <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                  <div className="bg-green-100 p-2 rounded-full inline-block mb-2">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-green-700 font-medium">Verification Successful</p>
                </div>
              </div>
            )}

            {showError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-lg">
                <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                  <div className="bg-red-100 p-2 rounded-full inline-block mb-2">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-700 font-medium">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleVerify}
              disabled={loadingFace || isVerifying}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
                ${loadingFace || isVerifying 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'
                }`}
            >
              {loadingFace || isVerifying ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify Face'
              )}
            </button>

            <button
              onClick={handleClose}
              className="w-full py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Payment Success Popup */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-green-700 font-medium text-xl">Payment Sent Successfully</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceVerificationModal;