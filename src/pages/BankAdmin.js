import React, { useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

const BankAdmin = () => {
  const [facePayId, setFacePayId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchUserByFacepayID = async (facePayId) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("facePayId", "==", facePayId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    return null;
  };

  const handleAddMoney = async () => {
    if (!facePayId || !amount || isNaN(amount) || amount <= 0) {
      setMessage("Please enter a valid FacePay ID and positive amount.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const userData = await fetchUserByFacepayID(facePayId);
      if (!userData) throw new Error("User not found!");
      
      const userRef = doc(db, "users", userData.id);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) throw new Error("User not found!");
      
      const newBalance = (userSnap.data().walletBalance || 0) + parseFloat(amount);
      await updateDoc(userRef, { walletBalance: newBalance });
      
      setMessage(`Successfully added ₹${amount} to user ${facePayId}. New Balance: ₹${newBalance}`);
      setFacePayId("");
      setAmount("");
    } catch (error) {
      console.error("Error adding money:", error);
      setMessage(error.message || "Failed to add money.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Bank Admin - Add Money</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter Facepay ID"
          value={facePayId}
          onChange={(e) => setFacePayId(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Enter Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
        <button
          onClick={handleAddMoney}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Add Money"}
        </button>
        {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default BankAdmin;