import React, { useEffect, useState } from "react";
import { getUserProfile } from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const response = await getUserProfile(token);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile");
      }
    };
    fetchProfile();
  }, [token]);

  return (
    <div>
      <h2>Profile</h2>
      {user ? <p>Welcome, {user.name}!</p> : <p>Loading profile...</p>}
    </div>
  );
};

export default Profile;
