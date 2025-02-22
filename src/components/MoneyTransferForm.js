const MoneyTransferForm = ({ receiverFacePayId, setReceiverFacePayId, amount, setAmount, handleSendMoneyClick, loading }) => {
  return (
    <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Send Money</h2>
      <input 
        type="text"
        placeholder="Receiver FacePay ID"
        value={receiverFacePayId}
        onChange={(e) => setReceiverFacePayId(e.target.value)}
        className="w-full p-3 mt-2 border border-gray-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
      <input 
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-3 mt-4 border border-gray-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
      <button 
        onClick={handleSendMoneyClick} 
        className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Processing..." : "Send Money"}
      </button>
    </div>
  );
};

export default MoneyTransferForm;