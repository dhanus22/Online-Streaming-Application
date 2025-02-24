import React, { useEffect, useState, useContext } from "react";
import axios from "../services/api";
import AuthContext from "../context/AuthContext";

const Subscription = () => {
  const { user } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("/subscriptions/plans");
        setPlans(response.data);
      } catch (err) {
        setError("Error fetching plans");
        console.error("Subscription fetch error:", err);
      }
    };

    const fetchUserSubscription = async () => {
      try {
        if (user) {
          const response = await axios.get(`/subscriptions/user/${user.id}`);
          setCurrentSubscription(response.data);
        }
      } catch (err) {
        console.error("Subscription status error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
    fetchUserSubscription();
  }, [user]);

  const handleSubscription = async (planId) => {
    try {
      const response = await axios.post("/subscriptions/subscribe", {
        userId: user.id,
        planId,
      });

      window.location.href = response.data.paymentUrl; // Redirect to payment gateway
    } catch (err) {
      setError("Subscription failed");
      console.error("Subscription error:", err);
    }
  };

  if (loading) return <p>Loading subscription details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="subscription-container">
      <h2>Subscription Plans</h2>

      {currentSubscription ? (
        <div className="current-subscription">
          <h3>Current Plan: {currentSubscription.planName}</h3>
          <p>Expires on: {new Date(currentSubscription.expiryDate).toDateString()}</p>
        </div>
      ) : (
        <p>You are not subscribed to any plan.</p>
      )}

      <div className="plan-list">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.name}</h3>
            <p>{plan.price} / {plan.duration}</p>
            <button onClick={() => handleSubscription(plan.id)}>Subscribe</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
