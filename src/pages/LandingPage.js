import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      {/* Navbar */}
      <nav className="p-6 bg-white bg-opacity-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Facepayapp</h1>
          <div className="space-x-4">
            <a href="/login" className="text-white hover:text-gray-200 font-bold">
              Login
            </a>
            <a href="/signup" className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:text-blue-200 font-bold">
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Revolutionize Payments with Facial Recognition
        </h1>
        <p className="text-xl text-gray-200 mb-8">
          Securely send and receive money with just a smile. Fast, easy, and
          contactless.
        </p>
        <div className="space-x-4">
          <a
            href="/signup"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
          >
            Login
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Why Choose Facepayapp?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 text-center">
            <img
              src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              alt="Facial Recognition"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-white mb-2">
              Facial Recognition
            </h3>
            <p className="text-gray-200">
              Securely authenticate payments using advanced facial recognition
              technology.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 text-center">
            <img
              src="https://images.unsplash.com/photo-1556741533-974f8e62a92d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              alt="Fast Transactions"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-white mb-2">
              Fast Transactions
            </h3>
            <p className="text-gray-200">
              Send and receive money instantly with just a few clicks.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 text-center">
            <img
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              alt="Secure Payments"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-white mb-2">
              Secure Payments
            </h3>
            <p className="text-gray-200">
              Your transactions are protected with end-to-end encryption.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white bg-opacity-10 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-200">
            &copy; {new Date().getFullYear()} Facepayapp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;