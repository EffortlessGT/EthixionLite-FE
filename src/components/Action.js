import React, { useState } from 'react';
import {
  loginForm,
  registrationForm,
  loginFormII,
  ResetUserPassword,
} from '../api';
import FadeUpOnScroll from './FadeUpOnScroll';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { GetService } from './ServiceAccifier';

function Action() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [requestedService] = useState(GetService() || 'DEFAULT_SERVICE');

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [mypwd, setMyPassword] = useState('');
  const [mypwdII, setPasswordII] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const alertMsg = null;

  const handleFlip = () => {
    setShowForgotPassword(false);
    setIsFlipped(!isFlipped);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    try {
      const resp = await ResetUserPassword({ email: resetEmail });
      if (resp.status !== 'success') {
        toast.error(resp.message || 'Failed to send reset instructions.');
        return;
      }

      toast.success(`Password reset instructions sent to ${resetEmail}`);
      setResetEmail('');
      setShowForgotPassword(false);
    } catch (err) {
      toast.error('Unable to send reset instructions.');
    }
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { username, password, requestedService };

    const emailPatt = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPatt.test(data.username)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const result = await loginForm(data);
      if (result.status === 'success') {
        window.location.href = result.redirectTo;
      }
    } catch (err) {
      toast.error('Unable to reach server.');
    }
  };

  // REGISTER
  const handleRegistration = async (e) => {
    e.preventDefault();

    const data = { fullname, email, mypwd, mypwdII };

    if (data.mypwd !== data.mypwdII) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const rs = await registrationForm(data);
      toast.error(rs.msg || 'Unexpected response');
    } catch (err) {
      toast.error('Server error');
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      const response = await loginFormII({
        email,
        googleLogin: true,
        requestedService,
      });

      if (response.status === 'success') {
        window.location.href = '/dashboard';
      } else {
        toast.error(response.message || 'Google Sign-In Failed');
      }
    } catch (err) {
      toast.error('No Account exists, Please sign up first.');
    }
  };

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);

    console.log(key, value);
  }

  return (
    <FadeUpOnScroll delay={0.3}>
      <div className="action-container">
        {alertMsg && toast.info(alertMsg)}

        {!showForgotPassword && (
          <>
            {/* Sign In */}
            <div className={`signin auth-panel ${isFlipped ? 'hide' : 'show'}`}>
              <h1>Sign In</h1>

              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
                <div className="google-login-wrapper">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() =>
                      toast.error('Google Sign-In Failed, try again later.')
                    }
                  />
                </div>

                <p
                  className="auth-link"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </p>
                <p className="auth-link" onClick={handleFlip}>
                  Don't have an account? Sign Up
                </p>
              </form>
            </div>

            {/* Sign Up */}
            <div className={`signup auth-panel ${isFlipped ? 'show' : 'hide'}`}>
              <h1>Sign Up</h1>

              <form onSubmit={handleRegistration}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={mypwd}
                  onChange={(e) => setMyPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={mypwdII}
                  onChange={(e) => setPasswordII(e.target.value)}
                />
                <button type="submit">Register</button>

                <p className="auth-link" onClick={handleFlip}>
                  Already have an account? Sign In
                </p>
              </form>
            </div>
          </>
        )}

        {showForgotPassword && (
          <div className="signin forgot-password-card auth-panel">
            <h1>Forgot Password</h1>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <button type="submit">Send Reset Link</button>
              <p
                className="auth-link"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Sign In
              </p>
            </form>
          </div>
        )}
      </div>
    </FadeUpOnScroll>
  );
}

export default Action;
