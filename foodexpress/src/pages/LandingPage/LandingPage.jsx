import React from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import WhyChooseUs from "./components/WhyChooseUs";
import FanFavorites from "./components/FanFavorites";
import MeetTheChefs from "./components/MeetTheChefs";
import FinalCTA from "./components/FinalCTA";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Section 1: The Hero (The Hook) */}
      <HeroSection onOrderNow={() => navigate("/menu")} />

      {/* Section 2: Why Choose Us? (The Trust) */}
      <WhyChooseUs />

      {/* Section 3: This Week's Fan Favorites (The Food) */}
      <FanFavorites onViewMenu={() => navigate("/menu")} />

      {/* Section 4: Meet The Chefs (The People) */}
      <MeetTheChefs />

      {/* Section 5: Final Call to Action (The Action) */}
      <FinalCTA onOrderNow={() => navigate("/menu")} />
    </div>
  );
};

export default LandingPage;