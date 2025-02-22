import React from 'react';

const TransactionHistory = ({ transactions }) => {
  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <div className="space-y-2">
        {transactions?.length > 0 ? (
          transactions.map((tx) => (
            <div key={tx.id} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>{tx.type}:</strong> ₹{tx.amount.toLocaleString()}{' '}
                {tx.type === "Sent" ? `to ${tx.to}` : `from ${tx.from}`}
              </p>
              <p className="text-xs text-gray-500">{new Date(tx.timestamp.toDate()).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;