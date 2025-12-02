  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { useAuth } from "../../context/AuthContext";
  import "./AccountPage.css";
  import { ClientApi } from "../../ClientApi/ClientApi";

  // Icons
  const EditIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const ChevronLeftIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );

  const EyeIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  const AccountPage = () => {
    const navigate = useNavigate();
    const { user,setuser,loadingUser } = useAuth();
   const[error,seterror]=useState({});
    // Local state for editing
    const [editMode, setEditMode] = useState({
      name: false,
      email: false,
      phone: false,
    });

    const [formData, setFormData] = useState({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleEdit = (field) => {
      setEditMode((prev) => ({ ...prev, [field]: true }));
    };

  const handleSave = async (field) => {
    try {
      if (field === "name") {
        const response = await ClientApi.updateUsername({id : user.id,name: formData.name});
        console.log(response);
      } else if (field === "email") {
      const response =  await ClientApi.updateEmail({id:user.id, email:formData.email});
        console.log(response);
      } else if (field === "phone") {
      const response =   await ClientApi.updatePhone(formData.phone);
        console.log(response);
      }

      // Mise à jour du contexte user
  setuser((prevUser) => ({
        ...prevUser,
        [field]: formData[field],
      }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
    } catch (error) {
      console.log("Erreur lors de la mise à jour :", error);
      if (error.response.status === 422) { 
        console.log(error.response.data.errors);
           seterror(error.response.data.errors);
        return;
      }
    }
  };


    const handleCancel = (field) => {
      setFormData((prev) => ({ ...prev, [field]: user?.[field] || "" }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
    };

    const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
      <div className="account-page">
        <div className="account-container">
          {/* Breadcrumb Navigation */}
          <nav className="account-breadcrumb">
            <button
              className="breadcrumb-back"
              onClick={() => navigate("/profile")}
              aria-label="Back to Profile"
            >
              <ChevronLeftIcon />
            </button>
            <div className="breadcrumb-path">
              <button
                className="breadcrumb-link"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-current">Account</span>
            </div>
          </nav>

          {/* Page Title */}
          <div className="account-header">
            <h1 className="account-title">Account Information</h1>
            <p className="account-subtitle">Manage your personal details</p>
          </div>

          {/* Account Information Cards */}
          <div className="account-cards">
            {/* name Card */}
            <div className="account-card">
              <div className="card-header">
                <h3 className="card-title">name</h3>
                {!editMode.name && (
                  <button
                    className="edit-button"
                    onClick={() => handleEdit("name")}
                  >
                    <EditIcon />
                    <span>Change</span>
                  </button>
                )}
              </div>

              {editMode.name ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      handleInputChange("name", e.target.value)
                    }
                    className="edit-input"
                    placeholder="Enter Username"
                  />
                   {error.name && (
  <p className="error-text">{error.name[0]}</p>
)}
                  <div className="edit-actions">
                    <button
                      className="cancel-button"
                      onClick={() => handleCancel("name")}
                    >
                      Cancel
                    </button>
                    <button
                      className="save-button"
                      onClick={() => handleSave("name")}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card-value">{formData.name || "Not set"}</div>
              )}
            </div>

            {/* Email Card */}
            <div className="account-card">
              <div className="card-header">
                <h3 className="card-title">Email</h3>
                {!editMode.email && (
                  <button
                    className="edit-button"
                    onClick={() => handleEdit("email")}
                  >
                    <EditIcon />
                    <span>Change</span>
                  </button>
                )}
              </div>

              {editMode.email ? (
                <div className="edit-form">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="edit-input"
                    placeholder="Enter email address"
                  />
                   {error.email && (
  <p className="error-text">{error.email[0]}</p>
)}
                  <div className="edit-actions">
                    <button
                      className="cancel-button"
                      onClick={() => handleCancel("email")}
                    >
                      Cancel
                    </button>
                    <button
                      className="save-button"
                      onClick={() => handleSave("email")}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card-value">{formData.email || "Not set"}</div>
              )}
            </div>

            {/* Password Card */}
            <div className="account-card">
              <div className="card-header">
                <h3 className="card-title">Password</h3>
                <button
                  className="edit-button"
                  onClick={() => navigate("/profile/change-password")}
                >
                  <EditIcon />
                  <span>Change</span>
                </button>
              </div>

              <div className="password-field">
                <span className="password-dots">
                  {showPassword ? "mypassword123" : "••••••••••••"}
                </span>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Phone Number Card */}
            <div className="account-card">
              <div className="card-header">
                <h3 className="card-title">Phone Number</h3>
                {!editMode.phone && (
                  <button
                    className="edit-button add-button"
                    onClick={() => handleEdit("phone")}
                  >
                    <EditIcon />
                    <span>{formData.phone ? "Change" : "Add"}</span>
                  </button>
                )}
              </div>

              {editMode.phone ? (
                <div className="edit-form">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="edit-input"
                    placeholder="Enter phone number"
                  />
      {error.phone && (
  <p className="error-text">{error.phone[1]}</p>
)}
                  <div className="edit-actions">
                    <button
                      className="cancel-button"
                      onClick={() => handleCancel("phone")}
                    >
                      Cancel
                    </button>
                    <button
                      className="save-button"
                      onClick={() => handleSave("phone")}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card-value">
                  {formData.phone || "Not added yet"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default AccountPage;