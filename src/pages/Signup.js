import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import FaceCapture from "../components/FaceCapture";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });
  const [isFaceCaptureOpen, setFaceCaptureOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;

      // Create user in Firestore
      await addDoc(collection(db, "users"), {
        uid,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        facePayId: formData.username + "@facepayapp", // Using Firebase UID as FacePay ID
        balance: 0,
        createdAt: new Date(),
      });

      setUserId(uid);
      setFaceCaptureOpen(true); // Open face capture modal
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {!isFaceCaptureOpen ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Facepayapp</h2>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Sign Up
            </button>
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
          </form>
        ) : (
          <FaceCapture userId={userId} onEnrollmentComplete={() => console.log("Face enrollment done")} />
        )}
      </div>
    </div>
  );
};

export default Signup;