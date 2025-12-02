import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu"; // ✅ Import your Menu component
import Footer from "../../components/Footer/Footer";

// import Footer from "../../components/Footer/Footer"; // (optional, for later)

/**
 * The Home page.
 * This component assembles all the main parts of your landing page:
 * Navbar, Header (Offers), Menu, and Footer.
 */
const Home = () => {
  return (
    <div className="home-page">
      {/* 1. Navbar at the top */}
      {/*<Navbar />*/}

      <main className="home-content">
        {/* 2. Header (offers section) */}
        <section id="offers">
          <Header />
        </section>

        {/* 3. Menu section — linked from Navbar */}
        <section
          id="menu"
          style={{
            minHeight: "100vh",
            padding: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <Menu />
        </section>

        {/* 4. Footer placeholder */}
        {/*<section
          id="contact"
          style={{
            minHeight: "300px",
            padding: "2rem",
            background: "#f1f5f9",
            textAlign: "center",
          }}
        >*/}
          {/*<Footer />*/}
          
        {/*</section>*/}
      </main>
    </div>
  );
};

export default Home;
