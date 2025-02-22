import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { CheckCircle, RefreshCw, AlertCircle } from "lucide-react";

const FaceCapture = ({ userId }) => {
  const webcamRef = useRef(null);
  const navigate = useNavigate(); // ✅ Initialize navigation
  const [loading, setLoading] = useState(false);
  const [UUID, setUUID] = useState(false);
  const [error, setError] = useState("");
  const [faceDetected, setFaceDetected] = useState(false);

  // Load models once when component mounts
  useEffect(() => {
    const loadModels = async () => {
      const modelPath = "/models";
      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
        faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath)
      ]);
    };
    loadModels();
  }, []);

  const fetchUserByUID = async (uid) => {
    try {
      const usersRef = collection(db, "users"); // Reference to 'users' collection
      const q = query(usersRef, where("uid", "==", uid)); // Query to find user by uid
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Get the first matching document
        console.log("User Data:", userDoc.data()); // ✅ Log user data
        return { id: userDoc.id, ...userDoc.data() }; // Return document ID + data
      } else {
        console.log("No user found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  fetchUserByUID(userId).then((userData) => {
    if (userData) {
      const uid = userData.id;
      setUUID(uid)
      console.log("Firestore Document ID:", uid);
    } else {
      console.log("User not found!");
    }
  });

  // Detect face in the webcam feed
  const detectFace = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const img = await faceapi.bufferToImage(await (await fetch(imageSrc)).blob());
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      setFaceDetected(!!detection);
      return { imageSrc, detection };
    } catch (error) {
      console.error("Face detection error:", error);
      setError("Face detection failed. Please try again.");
      return null;
    }
  };

  // Auto-detect face every second
  useEffect(() => {
    const interval = setInterval(async () => {
      await detectFace();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle face enrollment
  const handleEnrollUser = async () => {
    if (!faceDetected) {
      setError("No face detected. Please adjust your position.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const { imageSrc, detection } = await detectFace();
      if (!imageSrc || !detection) throw new Error("Failed to capture face data");
  
      // Convert image to Base64
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const reader = new FileReader();
  
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Image = reader.result;
  
        // Save to Firestore
        const userRef = doc(db, "users", UUID);
        const docSnap = await getDoc(userRef);


       if (docSnap.exists()) {
        await updateDoc(userRef, {
          image: base64Image,
          faceDescriptor: Array.from(detection.descriptor),
          updatedAt: new Date(),
        });
        console.log("Face data saved in Firestore");
        navigate("/login");
        console.log("User face data updated in Firestore");
      }else{
        console.log("User face data not updated in Firestore");
      }
       
      };
    } catch (error) {
      console.error("Face enrollment error:", error);
      setError("Face enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">Capture Your Face</h2>

      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
        <Webcam ref={webcamRef} screenshotFormat="image/png" className="w-full h-64 object-cover" />
        {faceDetected && (
          <div className="absolute bottom-2 right-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
            <CheckCircle size={16} className="mr-1" />
            Face Detected
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={handleEnrollUser}
        disabled={loading || !faceDetected}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <RefreshCw className="animate-spin mr-2" size={18} />
            Processing...
          </>
        ) : (
          "Capture & Enroll"
        )}
      </button>
    </div>
  );
};

export default FaceCapture;
