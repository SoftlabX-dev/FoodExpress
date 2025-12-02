import React from "react";
import "./MenuPage.css";
import Header from "../../components/Header/Header";
import Menu from "../../components/Menu/Menu";

/**
 * The Menu page.
 * This component displays the offers and complete food menu.
 */
const MenuPage = () => {
  return (
    <div className="menu-page">
      <main className="menu-content">
        {/* 1. Header (offers section) */}
        <section id="offers">
          <Header />
        </section>

        {/* 2. Menu section — main content */}
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
      </main>
    </div>
  );
};

export default MenuPage;