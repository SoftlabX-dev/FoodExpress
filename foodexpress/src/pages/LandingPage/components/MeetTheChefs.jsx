import React from "react";
import "./MeetTheChefs.css";

// Import local chef images
import chefJames from "../../../assets/chefs/chef.jpeg";
import chefMaria from "../../../assets/chefs/chef1.jpeg";
import chefDavid from "../../../assets/chefs/chef4.jpeg";

const MeetTheChefs = () => {
  const chefs = [
    {
      id: 1,
      name: "Chef James Rodriguez",
      title: "Head Chef & Grill Master",
      specialty: "Burgers & Premium Steaks",
      image: chefJames,
      experience: "12+ Years",
      awards: "James Beard Award Nominee",
      description:
        "With over a decade of experience, Chef James brings passion and expertise to every dish, specializing in crafting the perfect burger and steak.",
    },
    {
      id: 2,
      name: "Chef Maria Antonelli",
      title: "Pizza Artisan & Italian Specialist",
      specialty: "Authentic Italian Cuisine",
      image: chefMaria,
      experience: "10+ Years",
      awards: "Certified Neapolitan Pizza Master",
      description:
        "Bringing authentic Italian traditions to every dish, from hand-tossed pizzas to fresh pasta made daily.",
    },
    {
      id: 3,
      name: "Chef David Kim",
      title: "Executive Kitchen Manager",
      specialty: "Fusion & Modern Cuisine",
      image: chefDavid,
      experience: "15+ Years",
      awards: "Culinary Institute Graduate",
      description:
        "Leading our kitchen with precision and creativity, ensuring every meal exceeds expectations through innovative techniques.",
    },
  ];

  return (
    <section className="meet-the-chefs landing-section">
      <div className="landing-container">
        <div className="section-header">
          <h2 className="section-title">Our Master Chefs</h2>
        </div>

        <div className="chefs-grid">
          {chefs.map((chef) => (
            <div key={chef.id} className="chef-card">
              <div className="chef-image-container">
                <div className="image-frame">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="chef-image"
                    onError={(e) => {
                      // Fallback to a solid color avatar with initials
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `
                        <div class="chef-avatar">
                          ${chef.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      `;
                    }}
                  />
                </div>
              </div>

              <div className="chef-content">
                <div className="chef-experience">
                  <span className="experience-text">{chef.experience}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetTheChefs;