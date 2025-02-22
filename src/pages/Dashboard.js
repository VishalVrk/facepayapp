import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot, collection, query, where, orderBy ,getDocs,getDoc,updateDoc,addDoc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import WalletBalance from "../components/WalletBalance";
import MoneyTransferForm from "../components/MoneyTransferForm";
import FaceVerificationModal from "../components/FaceVerificationModal";
import TransactionHistory from "../components/TransactionHistory";
import * as faceapi from 'face-api.js';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [receiverFacePayId, setReceiverFacePayId] = useState("");
  const [userImage, setUserImage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isFaceVerifyOpen, setIsFaceVerifyOpen] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [loadingFace, setLoadingFace] = useState(false);
  const [descriptor, setDescriptor] = useState(null);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  const [faceDetected, setFaceDetected] = useState(false);

  const navigate = useNavigate();
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

   const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
      } catch (error) {
        console.log('Failed to load models');
      }
    };

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



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {        
        fetchUserByUID(user.uid).then((userData) => {
          if (userData) {
            const uid = userData.id;
            const userRef = doc(db, "users", uid);
            onSnapshot(userRef, (docSnap) => {
              if (docSnap.exists()) {
                setUser({ id: uid, ...docSnap.data() });
                setBalance(docSnap.data().walletBalance || 0);
                setUserImage(docSnap.data().image);
              }
            });
            fetchTransactions(uid);
            console.log("Firestore Document ID:", uid);
            const fetchDescriptor = async () => {
              try {
                const userDoc = await getDoc(doc(db, 'users', uid));
                if (userDoc.exists()) {
                  setDescriptor(userDoc.data().faceDescriptor);
                  console.log(userDoc.data().faceDescriptor)
                } else {
                  setError('User not found');
                }
              } catch (err) {
                setError('Failed to fetch face data');
              } finally {
                setLoading(false);
              }
            };
        
            fetchDescriptor();
            loadModels();    
            const interval = setInterval(async () => {
              await detectFace();
            }, 1000);
            
            return () => clearInterval(interval);   
          }       
          else {
            console.log("User not found!");
          }
        });  
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTransactions = async (userId) => {
    const transactionsRef = collection(db, "transactions");
    const q = query(transactionsRef, where("userId", "==", userId), orderBy("timestamp", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setTransactions(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  };

  const handleSendMoneyClick = () => setIsFaceVerifyOpen(true);


  const handleCloseFaceVerify = () => setIsFaceVerifyOpen(false);

  const handleVerify = async () => {
    if (!descriptor) return { error: 'No face data available' };
  
    try {
      const image = webcamRef.current.getScreenshot();
      const img = new Image();
      img.src = image;
      
      await new Promise(resolve => img.onload = resolve);
      const detection = await faceapi.detectSingleFace(
        img,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();
  
      if (!detection) {
        return { error: 'No face detected' };
      }
  
      const storedDescriptor = new Float32Array(descriptor);
      const distance = faceapi.euclideanDistance(detection.descriptor, storedDescriptor);
      
      if (distance < 0.6) {
        await handleSendMoney();
        return { success: true };
      } else {
        return { error: 'Face verification failed' };
      }
    } catch (error) {
      return { error: 'Verification error occurred' };
    }
  };

 
  const fetchUserByFacePayID = async (facePayId) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("facePayId", "==", facePayId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user by FacePay ID:", error);
      return null;
    }
  };

  const handleSendMoney = async () => {
    if (!receiverFacePayId || !amount || isNaN(amount) || amount <= 0) {
      setMessage("Please enter a valid FacePay ID and positive amount.");
      return;
    }

    if (amount > balance) {
      setMessage("Insufficient balance!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const receiver = await fetchUserByFacePayID(receiverFacePayId);
      if (!receiver) {
        setMessage("Receiver not found!");
        setLoading(false);
        return;
      }

      const senderRef = doc(db, "users", user.id);
      const receiverRef = doc(db, "users", receiver.id);

      const senderSnap = await getDoc(senderRef);
      const receiverSnap = await getDoc(receiverRef);

      if (!senderSnap.exists() || !receiverSnap.exists()) {
        setMessage("Transaction failed! User not found.");
        setLoading(false);
        return;
      }

      const senderBalance = senderSnap.data().walletBalance || 0;
      const receiverBalance = receiverSnap.data().walletBalance || 0;
      const transferAmount = parseFloat(amount);

      if (senderBalance < transferAmount) {
        setMessage("Insufficient balance!");
        setLoading(false);
        return;
      }

      // Update balances
      await updateDoc(senderRef, { walletBalance: senderBalance - transferAmount });
      await updateDoc(receiverRef, { walletBalance: receiverBalance + transferAmount });

      setBalance(senderBalance - transferAmount);

      // Save transaction for sender
      await addDoc(collection(db, "transactions"), {
        userId: user.id,
        type: "Sent",
        amount: transferAmount,
        to: receiverFacePayId,
        timestamp: new Date(),
      });

      // Save transaction for receiver
      await addDoc(collection(db, "transactions"), {
        userId: receiver.id,
        type: "Received",
        amount: transferAmount,
        from: user.facePayId,
        timestamp: new Date(),
      });

      setMessage(`Successfully sent ₹${transferAmount} to ${receiverFacePayId}!`);
      setAmount("");
      setReceiverFacePayId("");
    } catch (error) {
      console.error("Error transferring money:", error);
      setMessage("Transaction failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4 lg:p-8">
  <div className="max-w-7xl mx-auto">
    {/* Main Grid Layout */}
    <div className="grid lg:grid-cols-12 gap-6">
      {/* Left Column - Profile and Balance */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {user && <UserProfile user={user} userImage={userImage} />}
          <WalletBalance balance={balance} />
          <button
            onClick={() => signOut(auth)}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Right Column - Transfer Form and History */}
      <div className="lg:col-span-8 space-y-6">
        {/* Money Transfer Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <MoneyTransferForm
            receiverFacePayId={receiverFacePayId}
            setReceiverFacePayId={setReceiverFacePayId}
            amount={amount}
            setAmount={setAmount}
            handleSendMoneyClick={handleSendMoneyClick}
            loading={loading}
          />
        </div>

        {/* Transaction History Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </div>

    {/* Modal stays at the root level */}
    {isFaceVerifyOpen && (
      <FaceVerificationModal
        webcamRef={webcamRef}
        handleFaceVerified={handleVerify}
        handleClose={handleCloseFaceVerify}
        loadingFace={loadingFace}
        faceDetected={faceDetected}
      />
    )}
  </div>
</div>
  );
};

export default Dashboard;
