import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { VerifyUserAccount } from '../api';

const VerifyAccount = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const rs = await VerifyUserAccount(token);
        if (rs.status === 'success') {
          setStatus('success');
          setMessage(
            'Your account has been verified 🎉 You can now log in to Ethixion.'
          );
        } else if (rs.status === 'expired') {
          setStatus('error');
          setMessage(
            rs.msg || 'Link has expired or is invalid. Please register again.'
          );
        } else {
          setStatus('error');
          setMessage(
            rs.msg || 'Unable to verify account. Please try again later.'
          );
        }
      } catch (err) {
        setStatus('error');
        setMessage('Unable to verify account. Please try again later.');
      }
    };

    verify();
  }, []);

  useEffect(() => {
    if (status === 'error') {
      const timer = setTimeout(() => {
        window.location.href = '/action';
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="verify-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="verify-card"
      >
        {status === 'loading' && (
          <div className="verify-loading">
            <div className="spinner"></div>
            <p>Verifying your account...</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="verify-success"
          >
            <h2>✅ Verified Successfully</h2>
            <p>{message}</p>
            <a href="/action" className="btn btn-primary">
              Go to Login
            </a>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="verify-error"
          >
            <h2>❌ Verification Failed!</h2>
            <p>{message}</p>
            <p>
              You will be redirected in <b>10 seconds</b>...
            </p>
            <a href="/action" className="btn btn-secondary">
              Register Again
            </a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyAccount;
