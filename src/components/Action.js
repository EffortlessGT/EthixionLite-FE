import React, { useState } from 'react';
import { loginForm, registrationForm, loginFormII } from '../api';
import FadeUpOnScroll from './FadeUpOnScroll';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

function Action() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [mypwd, setMyPassword] = useState('');
  const [mypwdII, setPasswordII] = useState('');
  const alertMsg = null;

  const handleFlip = () => setIsFlipped(!isFlipped);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { username, password };

    const emailPatt = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPatt.test(data.username)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const result = await loginForm(data);
      if (result.status === 'success') {
        window.location.href = '/dashboard';
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

      const response = await loginFormII({ email, googleLogin: true });

      if (response.status === 'success') {
        window.location.href = '/dashboard';
      } else {
        toast.error(response.message || 'Google Sign-In Failed');
      }
    } catch (err) {
      toast.error('Please sign up first.');
    }
  };

  return (
    <FadeUpOnScroll delay={0.3}>
      <div className="action-container">
        {alertMsg && (
          toast.info(alertMsg)
        )}

        {/* Sign In */}
        <div className={`signin ${isFlipped ? 'hide' : 'show'}`}>
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

            <p onClick={handleFlip}>Don't have an account? Sign Up</p>

            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error('Google Sign-In Failed')}
            />
          </form>
        </div>

        {/* Sign Up */}
        <div className={`signup ${isFlipped ? 'show' : 'hide'}`}>
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

            <p onClick={handleFlip}>Already have an account? Sign In</p>
          </form>
        </div>
      </div>
    </FadeUpOnScroll>
  );
}

export default Action;
