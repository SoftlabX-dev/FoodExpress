import React, { useEffect } from "react";
import "./index.css";
import LandingPage from "./pages/LandingPage/LandingPage";
import MenuPage from "./pages/MenuPage/MenuPage";
import CartPage from "./pages/Cart/Cart";
import LoginPage from "./pages/Login/Login";
import SignupPage from "./pages/Signup/Signup";
import CheckoutPage from "./pages/Checkout/Checkout";
import PaymentPage from "./pages/Payment/Payment"; // ✅ NEW IMPORT
import ProfilePage from "./pages/Profile/Profile";
import ProfileMain from "./pages/Profile/ProfileMain";
import AccountPage from "./pages/Profile/AccountPage";
import OrdersPage from "./pages/Profile/OrdersPage";
import ChangePasswordForm from "./pages/Profile/ChangePasswordForm";
import Contact from "./pages/Contact/Contact";
import FoodExpressDashboard from "./admin/Dashboard/DashboardSimple";
import OrdersAdmin from "./admin/Orders/OrdersAdmin";
import MenuManagement from "./admin/Menu/MenuManagement";
import CustomersManagement from "./admin/Customers/CustomersManagement";
import DeliveriesManagement from "./admin/Deliveries/DeliveriesManagement";
import DriversManagement from "./admin/Drivers/DriversManagement";
import ReportsManagement from "./admin/Reports/ReportsManagement";
import Assigned from "./driver/Assigned/Assigned";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext"; // ✅ NEW IMPORT
import Navbar from "./components/Navbar/Navbar";
import ConditionalFooter from "./components/ConditionalFooter";
import Notification from "./components/Notification/Notification"; // ✅ NEW IMPORT

/**
 * Utility component to scroll to top on page change
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * Protected Route Component
 * Protects routes that require authentication
 */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  // Sinon, affiche le composant demandé
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  // 1. Vérification de l'authentification
  if (!isLoggedIn) {
    // Si l'utilisateur n'est pas connecté, redirection vers la page de connexion
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 2. Vérification du rôle
  if (user.role !== "admin") {
    // Si l'utilisateur est connecté mais n'est pas Admin, redirection vers la page d'accueil ou une page 403
    // On redirige vers la page d'accueil ('/') et on peut éventuellement afficher une notification d'accès refusé.
    console.log("Accès refusé. Rôle actuel:", user.role);
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est connecté ET est Admin, affiche le composant demandé
  return children;
};

/**
 * Driver Route Component
 * Protects routes that require driver role
 */
const DriverRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  // 1. Vérification de l'authentification
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 2. Vérification du rôle
  if (user.role !== "driver") {
    console.log("Accès refusé. Rôle actuel:", user.role);
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est connecté ET est Driver, affiche le composant demandé
  return children;
};
/**
 * Main App Component
 */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          {" "}
          {/* ✅ NEW: Wrap with OrderProvider */}
          <BrowserRouter>
            <div className="app-container">
              <Navbar />
              <Notification /> {/* ✅ NEW: Add Notification component */}
              <ScrollToTop />
              <main>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* ✅ NEW: Admin Dashboard Route */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <FoodExpressDashboard />
                      </AdminRoute>
                    }
                  />

                  {/* ✅ NEW: Admin Orders Management Route */}
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminRoute>
                        <OrdersAdmin />
                      </AdminRoute>
                    }
                  />

                  {/* ✅ NEW: Admin Menu Management Route */}
                  <Route
                    path="/admin/menu"
                    element={
                      <AdminRoute>
                        <MenuManagement />
                      </AdminRoute>
                    }
                  />

                  {/* ✅ NEW: Admin Customers Management Route */}
                  <Route
                    path="/admin/customers"
                    element={
                      <AdminRoute>
                        <CustomersManagement />
                      </AdminRoute>
                    }
                  />

                  {/* ✅ NEW: Admin Deliveries Route */}
                  <Route
                    path="/admin/deliveries"
                    element={
                      <AdminRoute>
                        <DeliveriesManagement />
                      </AdminRoute>
                    }
                  />

                  {/* ✅ NEW: Admin Drivers Route */}
                  <Route
                    path="/admin/drivers"
                    element={
                      <AdminRoute>
                        <DriversManagement />
                      </AdminRoute>
                    }
                  />

                  {/* ✅ NEW: Admin Reports Route */}
                  <Route
                    path="/admin/reports"
                    element={
                      <AdminRoute>
                        <ReportsManagement />
                      </AdminRoute>
                    }
                  />

                  {/* ✅ NEW: Payment Route */}
                  <Route
                    path="/payment"
                    element={
                      <ProtectedRoute>
                        <PaymentPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* ✅ NEW: Profile Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfileMain />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/account"
                    element={
                      <ProtectedRoute>
                        <AccountPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/orders"
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/change-password"
                    element={
                      <ProtectedRoute>
                        <ChangePasswordForm />
                      </ProtectedRoute>
                    }
                  />

                  {/* Contact Page Route */}
                  <Route path="/contact" element={<Contact />} />

                  {/* Driver Routes */}
                  <Route
                    path="/driver/assigned"
                    element={
                      <DriverRoute>
                        <Assigned />
                      </DriverRoute>
                    }
                  />
                  {/* TODO: Add order success route if needed */}
                  {/* 
                  <Route
                    path="/ordersuccess"
                    element={
                      <ProtectedRoute>
                        <OrderSuccessPage />
                      </ProtectedRoute>
                    }
                  />
                  */}
                </Routes>
              </main>
              <ConditionalFooter />
            </div>
          </BrowserRouter>
        </OrderProvider>{" "}
        {/* ✅ NEW: Close OrderProvider */}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
