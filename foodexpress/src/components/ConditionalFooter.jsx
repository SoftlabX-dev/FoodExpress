import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer/Footer";

/**
 * ConditionalFooter Component
 * This component decides whether to show or hide the footer
 * based on the current page URL
 */
const ConditionalFooter = () => {
  const location = useLocation();

  // List of paths where the footer should be HIDDEN
  const hideOnPaths = [
    "/login",
    "/signup",
    "/checkout",
    "/payment",
    "/ordersuccess",
    "/admin/dashboard",
    "/admin/orders",
    "/admin/menu",
    "/admin/customers",
    "/admin/deliveries",
    "/admin/drivers",
  ];

  // Check if current path is in the hidden list or starts with /admin/
  const shouldHideFooter =
    hideOnPaths.includes(location.pathname) ||
    location.pathname.startsWith("/admin/");

  // If footer should be hidden, return nothing
  if (shouldHideFooter) {
    return null;
  }

  // Otherwise, render the full footer
  return <Footer />;
};

export default ConditionalFooter;
