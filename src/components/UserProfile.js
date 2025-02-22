const UserProfile = ({ user, userImage }) => {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {user && (
        <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg mb-6">
          {userImage && <img src={userImage} alt="User" className="w-16 h-16 rounded-full border" />}
          <div>
            <h2 className="text-lg font-semibold">{user.fullName || "User"}</h2>
            <p className="text-gray-500">FacePay ID: {user.facePayId}</p>
          </div>
        </div>
      )}
      </div>
    );
  };
  
  export default UserProfile;
  