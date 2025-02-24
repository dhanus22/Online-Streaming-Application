import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../services/api"; // Ensure this file handles API requests
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [watchHistory, setWatchHistory] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const historyResponse = await axios.get("/user/watch-history");
        const subscriptionResponse = await axios.get("/user/subscription");
        setWatchHistory(historyResponse.data);
        setSubscription(subscriptionResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name}!</h2>

      <section className="dashboard-section">
        <h3>Subscription Status</h3>
        {subscription ? (
          <p>Active Plan: {subscription.plan} (Expires: {subscription.expiry})</p>
        ) : (
          <p>
            No active subscription. <Link to="/subscription">Subscribe Now</Link>
          </p>
        )}
      </section>

      <section className="dashboard-section">
        <h3>Watch History</h3>
        {watchHistory.length > 0 ? (
          <ul>
            {watchHistory.map((video) => (
              <li key={video.id}>
                <Link to={`/watch/${video.id}`}>{video.title}</Link> - Last watched: {video.lastWatched}
              </li>
            ))}
          </ul>
        ) : (
          <p>No watch history available.</p>
        )}
      </section>

      <section className="dashboard-section">
        <h3>Recommended for You</h3>
        {/* This can be populated with AI-based recommendations in Phase 4 */}
        <p>Coming Soon...</p>
      </section>
    </div>
  );
};

export default Dashboard;
