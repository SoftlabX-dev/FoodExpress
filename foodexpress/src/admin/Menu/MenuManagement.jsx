import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUtensils,
  FaSearch,
  FaPlus,
  FaTimes,
  FaCheck,
  FaFire,
  FaStar,
  FaShoppingBag,
  FaUserCircle,
  FaChartLine,
  FaTruck,
  FaMotorcycle,
  FaFileAlt,
  FaBars,
} from "react-icons/fa";
import { MdEdit, MdRemoveShoppingCart } from "react-icons/md";
import "./MenuManagement.css";
import { ClientApi } from "../../ClientApi/ClientApi";

const MenuManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plats, setPlats] = useState([]);
  const [cat, setCat] = useState([]);

  // --- Fetch Data Logic ---
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      pizza: "🍕",
      burgers: "🍔",
      tacos: "🌮",
      chicken: "🍗",
      sandwich: "🥪",
    };
    const normalizedName = categoryName?.toLowerCase().trim();
    return iconMap[normalizedName] || "🍽️";
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const catResponse = await ClientApi.getCategories();
      console.log(catResponse.data.categories);
      const formattedCategories = catResponse.data.categories.map((c) => ({
        // Correction 1: S'assurer que l'ID de la catégorie est une chaîne de caractères
        id: String(c.id),
        name: c.nom || "Other",
        icon: getCategoryIcon(c.nom),
        count: c.total_products || 0,
      }));

      setCat(formattedCategories);

      const platsResponse = await ClientApi.GetPlats();
      console.log(platsResponse.data);
      setPlats(platsResponse.data);
    } catch (err) {
      console.error("Erreur API:", err);
      setError("Impossible de récupérer les données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const adminPages = [
    {
      id: 1,
      name: "Dashboard",
      icon: <FaChartLine />,
      path: "/admin/dashboard",
    },
    { id: 2, name: "Orders", icon: <FaShoppingBag />, path: "/admin/orders" },
    { id: 3, name: "Menu", icon: <FaUtensils />, path: "/admin/menu" },
    {
      id: 4,
      name: "Customers",
      icon: <FaUserCircle />,
      path: "/admin/customers",
    },
    { id: 5, name: "Deliveries", icon: <FaTruck />, path: "/admin/deliveries" },
    { id: 6, name: "Drivers", icon: <FaMotorcycle />, path: "/admin/drivers" },
    { id: 7, name: "Reports", icon: <FaFileAlt />, path: "/admin/reports" },
  ];

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (plats.length || cat.length) {
      const allCategories = [
        { id: "all", name: "All Items", icon: "🍽️", count: plats.length },
        ...cat,
      ];

      setCategories(allCategories);
    }
  }, [plats, cat]);

  const menuItems = useMemo(
    () =>
      plats.map((plat) => ({
        id: plat.id,
        name: plat.nom || "N/A",
        // Correction 2: S'assurer que l'ID de la catégorie du plat est une chaîne
        category: String(plat.category_id) || "other",
        description: plat.description || "No description",
        price: plat.prix || 0,
        image: plat.image,
        isAvailable: plat.isAvailable ?? true,
        isPopular: plat.isPopular || false,
        isFeatured: plat.isFeatured || false,
        rating: 4.5,
        reviews: plat.review_count || 0,
        discount: plat.discount || 0,
        preparationTime: "15-20 min",
        calories: 0,
      })),
    [plats]
  );

  const filteredItems = menuItems.filter((item) => {
    // La comparaison fonctionne maintenant car selectedCategory et item.category sont des strings
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // AJOUTER UN PLAT
  const handleAddItem = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nom", e.target.name.value);
    formData.append("category_id", e.target.category.value);
    formData.append("prix", e.target.price.value);
    formData.append("description", e.target.description.value);
    formData.append("discount", e.target.discount.value || 0);
    formData.append("isAvailable", e.target.isAvailable.checked ? 1 : 0);
    formData.append("isPopular", e.target.isPopular.checked ? 1 : 0);
    formData.append("isFeatured", e.target.isFeatured.checked ? 1 : 0);

    // **Fichier image**
    formData.append("image", e.target.image.files[0]);

    try {
      await ClientApi.PostPlats(formData, true); // true si tu veux préciser multipart
      setShowAddModal(false);
      fetchData();
      e.target.reset();
      alert("Plat ajouté avec succès !");
    } catch (err) {
      console.error("Erreur ajout:", err);
      alert("Erreur lors de l'ajout du plat");
    }
  };

  // MODIFIER UN PLAT
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    const formData = new FormData(e.target);

    const updatedPlat = {
      nom: formData.get("name"),
      category_id: formData.get("category"),
      prix: parseFloat(formData.get("price")),
      description: formData.get("description"),
      discount: parseInt(formData.get("discount")) || 0,
      image: formData.get("image"),
      isAvailable: formData.get("isAvailable") === "on",
      isPopular: formData.get("isPopular") === "on",
      isFeatured: formData.get("isFeatured") === "on",
    };

    try {
      await ClientApi.UpdatePlat(selectedItem.id, updatedPlat);
      setShowEditModal(false);
      setSelectedItem(null);
      fetchData();
      e.target.reset();
      alert("Plat modifié avec succès !");
    } catch (err) {
      console.error("Erreur modification:", err);
      alert("Erreur lors de la modification du plat");
    }
  };

  // SUPPRIMER UN PLAT
  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await ClientApi.DeletePlat(itemId);
        fetchData();
        alert("Plat supprimé avec succès !");
      } catch (err) {
        console.error("Erreur suppression:", err);
        alert("Erreur lors de la suppression du plat");
      }
    }
  };

  // TOGGLE DISPONIBILITÉ
  const handleToggleAvailability = async (itemId) => {
    try {
      const plat = plats.find((p) => p.id === itemId);
      if (!plat) return;

      await ClientApi.UpdatePlat(itemId, {
        isAvailable: !plat.isAvailable,
      });
      fetchData();
    } catch (err) {
      console.error("Erreur toggle:", err);
      alert("Erreur lors de la mise à jour");
    }
  };

  // CLONER UN PLAT
  const handleCloneItem = async (item) => {
    const clonedPlat = {
      nom: `${item.name} (Copy)`,
      category_id: item.category,
      prix: item.price,
      description: item.description,
      discount: item.discount,
      image: item.image,
      isAvailable: item.isAvailable,
      isPopular: false,
      isFeatured: false,
    };

    try {
      await ClientApi.PostPlats(clonedPlat);
      fetchData();
      alert("Plat cloné avec succès !");
    } catch (err) {
      console.error("Erreur clone:", err);
      alert("Erreur lors du clonage");
    }
  };

  if (loading) {
    return (
      <div className="loading-state">Chargement des données du menu...</div>
    );
  }

  if (error) {
    return <div className="error-state">Erreur de chargement: {error}</div>;
  }

  return (
    <div className="menu-management-container">
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="sidebar-header">
          <div className="sidebar-header-content">
            {sidebarOpen && (
              <div className="logo-section">
                <div className="logo-icon">
                  <FaUtensils />
                </div>
                <div className="logo-text">
                  <h1>FoodExpress</h1>
                  <p>Admin Panel</p>
                </div>
              </div>
            )}
            {!sidebarOpen && (
              <div className="logo-icon-only">
                <FaUtensils />
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {adminPages.map((page) => (
            <Link
              key={page.id}
              to={page.path}
              className={`nav-item ${
                location.pathname === page.path ? "active" : ""
              }`}
            >
              <span className="nav-icon">{page.icon}</span>
              {sidebarOpen && (
                <div className="nav-text">
                  <p>{page.name}</p>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="sidebar-footer">
            <button className="logout-btn">
              <span>🚪</span> Logout
            </button>
          </div>
        )}
      </div>

      <div className="main-content">
        <div className="menu-management">
          <div className="menu-header">
            <div className="header-content">
              <div className="header-left">
                <div className="header-icon">
                  <FaUtensils />
                </div>
                <div>
                  <h1 className="page-title">Menu Management</h1>
                  <p className="page-subtitle">
                    Manage your food items, categories, and pricing
                  </p>
                </div>
              </div>
              <div className="header-actions">
                <button
                  className="header-btn add-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  <FaPlus />
                  Add New Item
                </button>
              </div>
            </div>
          </div>

          <div className="menu-stats">
            <div className="stat-card total">
              <div className="stat-icon">
                <FaUtensils />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Items</span>
                <span className="stat-value">{menuItems.length}</span>
              </div>
            </div>
            <div className="stat-card available">
              <div className="stat-icon">
                <FaCheck />
              </div>
              <div className="stat-info">
                <span className="stat-label">Available</span>
                <span className="stat-value">
                  {menuItems.filter((i) => i.isAvailable).length}
                </span>
              </div>
            </div>
          </div>

          <div className="categories-section">
            <div className="categories-scroll">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-chip ${
                    selectedCategory === category.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="menu-toolbar">
            <div className="modern-search-container">
              <div className="modern-search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="🔍 Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="modern-search-input"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="clear-search-btn"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={`menu-items ${viewMode}`}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`menu-card ${
                  !item.isAvailable ? "unavailable" : ""
                }`}
              >
                <div className="item-image-container">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-image"
                  />
                  {!item.isAvailable && (
                    <div className="unavailable-overlay">
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="item-info">
                  <div className="item-header">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-rating">
                      <FaStar className="star-icon" />
                      <span>{item.rating}</span>
                      <span className="reviews-count">({item.reviews})</span>
                    </div>
                  </div>

                  <div className="item-footer">
                    <div className="item-pricing">
                      <span className="current-price">{item.price} $</span>
                    </div>

                    <div className="item-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditItem(item)}
                        title="Edit Item"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className={`action-btn outofstock-btn ${
                          !item.isAvailable ? "marked-unavailable" : ""
                        }`}
                        onClick={() => handleToggleAvailability(item.id)}
                        title={
                          item.isAvailable
                            ? "Mark Out of Stock"
                            : "Mark Available"
                        }
                      >
                        {item.isAvailable ? (
                          <MdRemoveShoppingCart />
                        ) : (
                          <FaCheck />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MODAL AJOUT */}
          {showAddModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowAddModal(false)}
            >
              <div
                className="modal-content large-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Add New Item</h2>
                  <button
                    className="modal-close"
                    onClick={() => setShowAddModal(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="modal-body">
                  <form className="item-form" onSubmit={handleAddItem}>
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label>Item Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter item name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Category</label>
                        <select name="category" required>
                          {/* Les IDs des options sont des chaînes de caractères */}
                          {cat.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Price ($)</label>
                        <input
                          type="number"
                          name="price"
                          placeholder="0.00"
                          step="0.01"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Image URL</label>
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setShowAddModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Add Item
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* MODAL ÉDITION */}
          {showEditModal && selectedItem && (
            <div
              className="modal-overlay"
              onClick={() => setShowEditModal(false)}
            >
              <div
                className="modal-content large-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Edit Item: {selectedItem.name}</h2>
                  <button
                    className="modal-close"
                    onClick={() => setShowEditModal(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="modal-body">
                  <form className="item-form" onSubmit={handleUpdateItem}>
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label>Item Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter item name"
                          defaultValue={selectedItem.name}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Category</label>
                        <select
                          name="category"
                          defaultValue={selectedItem.category}
                          required
                        >
                          {/* Les IDs des options sont des chaînes de caractères */}
                          {cat.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Price ($)</label>
                        <input
                          type="number"
                          name="price"
                          placeholder="0.00"
                          step="0.01"
                          defaultValue={selectedItem.price}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Image URL</label>
                        <input
                          type="text"
                          name="image"
                          placeholder="Enter image URL"
                          defaultValue={selectedItem.image}
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setShowEditModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
