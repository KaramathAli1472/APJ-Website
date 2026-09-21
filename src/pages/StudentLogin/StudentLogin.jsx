import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginStudent } from "../../services/auth/authService";

import "./StudentLogin.css";

function StudentLogin() {
  const navigate = useNavigate();
  const [registrationId, setRegistrationId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginId = registrationId.trim().toUpperCase();

    if (!loginId || !dateOfBirth) {
      setError("Please enter your Registration ID and date of birth.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await loginStudent(loginId, dateOfBirth);
      navigate("/student/dashboard");
    } catch (loginError) {
      console.error("Student login error:", loginError);
      setError("Invalid Registration ID or date of birth.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="student-login-page">
      <section className="student-login-card">
        <span className="student-login-label">APJ EDU</span>
        <h1>Student Login</h1>
        <p>Use your Registration ID and date of birth to continue.</p>

        {error && <div className="student-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="student-registration-id">Registration ID</label>
          <input
            id="student-registration-id"
            value={registrationId}
            onChange={(event) => setRegistrationId(event.target.value)}
            placeholder="APJ-2026-DZW8"
            autoComplete="username"
          />

          <label htmlFor="student-date-of-birth">Date of Birth</label>
          <input
            id="student-date-of-birth"
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            autoComplete="current-password"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <Link to="/admission">Need registration? Register here</Link>
      </section>
    </main>
  );
}

export default StudentLogin;
