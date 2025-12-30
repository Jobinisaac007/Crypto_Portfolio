import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    alert("Register Logic Coming After Backend Setup 🚀");
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="brand">
          <div className="brand-icon">₿</div>
          <div>
            <h1 className="brand-title">CryptoTracker</h1>
            <p className="brand-subtitle">
              Professional crypto portfolio management
            </p>
          </div>
        </div>

        <div className="feature-list">
          <div className="feature-item">
            <div className="feature-icon green">🔐</div>
            <div>
              <h3>Secure Accounts</h3>
              <p>Protect your portfolio with strong authentication.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon red">⚠</div>
            <div>
              <h3>Scam Alerts</h3>
              <p>Stay notified about suspicious tokens and wallets.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-tabs">
            <Link to="/" className="tab">
              Login
            </Link>
            <button className="tab active">Sign Up</button>
          </div>

          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">
            Start managing your crypto portfolio smartly
          </p>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="primary-btn" onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}