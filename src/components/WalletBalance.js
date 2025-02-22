const WalletBalance = ({ balance }) => {
    return (
      <div className="mb-4 p-4 bg-green-100 rounded-lg text-center">
        <h2 className="text-lg font-semibold">Wallet Balance</h2>
        <p className="text-2xl font-bold">₹ {balance.toFixed(2)}</p>
      </div>
    );
  };
  
  export default WalletBalance;
  