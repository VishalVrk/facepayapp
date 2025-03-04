import React, { useState, useRef } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Webcam from "react-webcam";
import { Camera, Upload, X, Edit, CheckCircle, AlertCircle } from "lucide-react";

const UserProfile = ({ user, userImage, db, uid }) => {
  const [showImageUpdatePopup, setShowImageUpdatePopup] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const webcamRef = useRef(null);

  const handleImageUpdate = async () => {
    if (!newImage) {
      setErrorMessage("Please select or capture an image.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear error after 3 seconds
      return;
    }

    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { image: newImage });
      setSuccessMessage("Profile image updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        setShowImageUpdatePopup(false);
        setNewImage(null);
      }, 3000); // Clear success message and close popup after 3 seconds
    } catch (error) {
      setErrorMessage("Failed to update profile image. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear error after 3 seconds
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setNewImage(imageSrc);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {user && (
        <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg mb-6">
          {userImage && (
            <div className="relative">
              <img
                src={userImage}
                alt="User"
                className="w-16 h-16 rounded-full border cursor-pointer"
                onClick={() => setShowImageUpdatePopup(true)}
              />
              <div
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 border shadow-sm cursor-pointer"
                onClick={() => setShowImageUpdatePopup(true)}
              >
                <Edit size={14} className="text-gray-600" />
              </div>
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">{user.fullName || "User"}</h2>
            <p className="text-gray-500">FacePay ID: {user.facePayId}</p>
          </div>
        </div>
      )}

      {/* Image Update Popup */}
      {showImageUpdatePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Update Profile Image</h2>
              <button
                onClick={() => {
                  setShowImageUpdatePopup(false);
                  setNewImage(null);
                  setIsWebcamActive(false);
                }}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {newImage ? (
                <div className="flex flex-col items-center">
                  <img
                    src={newImage}
                    alt="New Profile"
                    className="w-32 h-32 rounded-full border mb-4"
                  />
                  <button
                    onClick={handleImageUpdate}
                    className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setIsWebcamActive(true)}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Camera size={18} className="mr-2" />
                    Take a New Photo
                  </button>

                  <label className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center cursor-pointer">
                    <Upload size={18} className="mr-2" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              )}

              {isWebcamActive && (
                <div className="mt-6">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-lg shadow-md border border-gray-200"
                  />
                  <button
                    onClick={capturePhoto}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-4"
                  >
                    Capture Photo
                  </button>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {errorMessage}
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  {successMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;