import React, { useState } from 'react';
import { loginForm, registrationForm, loginFormII } from '../api';
import FadeUpOnScroll from './FadeUpOnScroll';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import EthixionAlert from './EthixionAlert';
import { toast } from 'react-toastify';

function Action() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [mypwd, setMyPassword] = useState('');
  const [mypwdII, setPasswordII] = useState('');
  const [alertMsg, setAlertMsg] = useState(null);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { username, password };

    const emailPatt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const strongPwdPatt = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!emailPatt.test(data.username)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!strongPwdPatt.test(data.password)) {
      toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }

    try {
      const result = await loginForm(data);
      if (result.status == "success") {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      <EthixionAlert msg={"Unable to reach to server. Please try again later."} />
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    const data = { fullname, email, mypwd, mypwdII };

    const fullnamePatt = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const emailPatt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const strongPwdPatt = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!fullnamePatt.test(data.fullname)) {
      toast.error('Only characters allowed in full name.');
      return;
    }

    if (!emailPatt.test(data.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!strongPwdPatt.test(data.mypwd)) {
      toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }

    if (data.mypwd !== data.mypwdII) {
      toast.error('Both passwords do not match.');
      return;
    }

    try {
      const rs = await registrationForm(data);
      setAlertMsg(rs.msg || "Unexpected response from server.");
    } catch (err) {
      console.error("Registration error:", err);
      setAlertMsg("Unable to reach server. Please try again later.");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;
      const response = await loginFormII({ email, googleLogin: true });
    } catch (err) {
      toast.error("This email is not registered. Please sign up first.");
      console.log("Google Sign-In error:", err);
    }
  };


  return (
    <FadeUpOnScroll delay={0.3}>
      <div className="action-container">
        {alertMsg && (
          <EthixionAlert msg={alertMsg} onClose={() => setAlertMsg(null)} />
        )}
        {/* Sign In */}
        <div className={`signin ${isFlipped ? 'hide' : 'show'}`}>
          <h1>Sign In</h1>
          <p>Welcome Back!</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="username"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="links">
              <p>Forgot Password?</p>
            </div>
            <button type="submit">Login</button>
            <p onClick={handleFlip}>Don't have an account? Sign Up</p>
            <div className="horizontal-rule"></div>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Google Sign-In Failed")}
            />
          </form>
        </div>

        {/* Sign Up */}
        <div className={`signup ${isFlipped ? 'show' : 'hide'}`}>
          <h1>Sign Up</h1>
          <form onSubmit={handleRegistration}>
            <input
              type="text"
              name="tb1"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
            <input
              type="email"
              name="tb2"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="tb3"
              placeholder="Password"
              value={mypwd}
              onChange={(e) => setMyPassword(e.target.value)}
            />
            <input
              type="password"
              name="tb4"
              placeholder="Confirm Password"
              value={mypwdII}
              onChange={(e) => setPasswordII(e.target.value)}
            />
            <div className="tccontainer">
              <input type="checkbox" required /> I Accept Ethixion Terms & Conditions.
            </div>
            <button type="submit">Register</button>
            <p onClick={handleFlip}>Already have an account? Sign In</p>
          </form>
        </div>
      </div>
    </FadeUpOnScroll>
  );
}

export default Action;
