import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ChangePasswordForm.css";
import { ClientApi } from "../../ClientApi/ClientApi";

// Icons
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

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Password validation rules
  const validatePassword = (password) => {
    const validations = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password),
    };

    return validations;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Current password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const validations = validatePassword(formData.newPassword);
      if (!Object.values(validations).every(Boolean)) {
        newErrors.newPassword = "Password does not meet requirements";
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Check if new password is same as current
    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      const response = await ClientApi.updatePassword({password : formData.newPassword,password_confirmation:formData.confirmPassword});
      console.log(response.data);
      // Show success state
      setShowSuccess(true);
      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate("/profile/account");
      }, 3000);
    } catch (error) {
      console.error("Password change failed:", error);
      setErrors({ general: "Failed to change password. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile/account");
  };

  // Get password validation status for new password
  const passwordValidations = validatePassword(formData.newPassword);

  if (showSuccess) {
    return (
      <div className="change-password-page">
        <div className="change-password-container">
          <div className="success-state">
            <div className="success-icon">
              <CheckIcon />
            </div>
            <h2 className="success-title">Password Changed!</h2>
            <p className="success-message">
              Your password has been updated successfully. You will be
              redirected to your account page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="change-password-page">
      <div className="change-password-container">
        {/* Breadcrumb Navigation */}
        <nav className="password-breadcrumb">
          <button
            className="breadcrumb-back"
            onClick={() => navigate("/profile/account")}
            aria-label="Back to Account"
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
            <button
              className="breadcrumb-link"
              onClick={() => navigate("/profile/account")}
            >
              Account
            </button>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Change Password</span>
          </div>
        </nav>

        {/* Form Header */}
        <div className="form-header">
          <h1 className="form-title">Change Password</h1>
          <p className="form-subtitle">Update your account password</p>
        </div>

        {/* Password Change Form */}
        <form onSubmit={handleSubmit} className="password-form">
          {/* General Error */}
          {errors.general && (
            <div className="error-alert">
              <XIcon />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Current Password */}
          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              Current Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="currentPassword"
                type={showPasswords.currentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                className={`form-input ${
                  errors.currentPassword ? "input-error" : ""
                }`}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("currentPassword")}
                aria-label={
                  showPasswords.currentPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPasswords.currentPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.currentPassword && (
              <span className="form-error">{errors.currentPassword}</span>
            )}
          </div>

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="newPassword"
                type={showPasswords.newPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className={`form-input ${
                  errors.newPassword ? "input-error" : ""
                }`}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("newPassword")}
                aria-label={
                  showPasswords.newPassword ? "Hide password" : "Show password"
                }
              >
                {showPasswords.newPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="password-requirements">
                <div
                  className={`requirement ${
                    passwordValidations.minLength ? "valid" : "invalid"
                  }`}
                >
                  {passwordValidations.minLength ? "✓" : "✗"} At least 8
                  characters
                </div>
                <div
                  className={`requirement ${
                    passwordValidations.hasUppercase ? "valid" : "invalid"
                  }`}
                >
                  {passwordValidations.hasUppercase ? "✓" : "✗"} One uppercase
                  letter
                </div>
                <div
                  className={`requirement ${
                    passwordValidations.hasLowercase ? "valid" : "invalid"
                  }`}
                >
                  {passwordValidations.hasLowercase ? "✓" : "✗"} One lowercase
                  letter
                </div>
                <div
                  className={`requirement ${
                    passwordValidations.hasNumber ? "valid" : "invalid"
                  }`}
                >
                  {passwordValidations.hasNumber ? "✓" : "✗"} One number
                </div>
                <div
                  className={`requirement ${
                    passwordValidations.hasSpecial ? "valid" : "invalid"
                  }`}
                >
                  {passwordValidations.hasSpecial ? "✓" : "✗"} One special
                  character (!@#$%^&*)
                </div>
              </div>
            )}

            {errors.newPassword && (
              <span className="form-error">{errors.newPassword}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showPasswords.confirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={`form-input ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                aria-label={
                  showPasswords.confirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPasswords.confirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="form-error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Changing Password..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;