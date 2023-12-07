import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <p>Email: {user.additionalInfo.email}</p>
      <p>Preferences:</p>
      <ul>
        <li>Dietary: {user.additionalInfo.preferences.dietary.join(', ')}</li>
        <li>Cuisine: {user.additionalInfo.preferences.cuisine.join(', ')}</li>
      </ul>
    </div>
  );
};

export default ProfilePage;
