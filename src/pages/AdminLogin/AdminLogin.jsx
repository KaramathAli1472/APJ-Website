import { useState } from "react";
import societyLogo from "../../assets/logo/logo.png.jpeg";
import { Link, useNavigate } from "react-router-dom";

import { loginAdmin } from "../../services/auth/authService";

import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      await loginAdmin(email, password);

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);

      if (
        error.code ===
        "auth/invalid-credential"
      ) {
        setError(
          "Invalid email or password."
        );
      } else if (
        error.code ===
        "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email address."
        );
      } else if (
        error.code ===
        "auth/user-disabled"
      ) {
        setError(
          "This admin account has been disabled."
        );
      } else if (
        error.code ===
        "auth/too-many-requests"
      ) {
        setError(
          "Too many login attempts. Please try again later."
        );
      } else if (
        error.code ===
        "auth/admin-claim-required"
      ) {
        setError(
          "Login successful, but this account is not marked as an admin. Please add the admin claim in Firebase and try again."
        );
      } else {
        setError(
          "Login failed. Please check your details and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-left">

        <Link
          to="/"
          className="admin-login-brand"
        >
          <div className="admin-login-brand-logo">
            <img
              src={societyLogo}
              alt="APJ Abdul Kalam Welfare Society"
            />
          </div>

          <div>
            <strong>APJ EDU</strong>

            <span>
              APJ Abdul Kalam Welfare Society
            </span>
          </div>
        </Link>

        <div className="admin-login-content">

          <span className="admin-login-badge">
            ADMINISTRATION
          </span>

          <h1>
            Welcome to
            <br />
            <strong>APJ EDU Admin Panel</strong>
          </h1>

          <p>
            Manage registrations, classes, syllabus,
            notices and website content from one
            secure dashboard.
          </p>

          <div className="admin-login-features">

            <div>
              <span>✓</span>
              Secure administrator access
            </div>

            <div>
              <span>✓</span>
              Manage website content
            </div>

            <div>
              <span>✓</span>
              Centralized administration
            </div>

          </div>

        </div>

        <div className="admin-login-left-footer">
          © {new Date().getFullYear()} APJ EDU.
          All rights reserved.
        </div>

      </div>


      <div className="admin-login-right">

        <div className="admin-login-card">

          <div className="admin-login-card-header">

            <div className="admin-login-mobile-logo">
              A
            </div>

            <span>
              ADMIN LOGIN
            </span>

            <h2>
              Sign in to your account
            </h2>

            <p>
              Enter your administrator credentials
              to continue.
            </p>

          </div>


          {error && (
            <div className="admin-login-error">
              <span>!</span>
              {error}
            </div>
          )}


          <form
            className="admin-login-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="admin-login-input-wrapper">

                <span className="admin-login-input-icon">
                  @
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

              </div>

            </div>


            <div className="admin-login-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="admin-login-input-wrapper">

                <span className="admin-login-input-icon">
                  •
                </span>

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            <button
              type="submit"
              className="admin-login-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="admin-login-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          <div className="admin-login-back">

            <Link to="/">
              ← Back to Website
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;