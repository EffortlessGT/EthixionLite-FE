import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { VerifyResetPasswordToken, ChangeUserPassword } from '../api';

function VerifyResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setMessage('Invalid reset link.');
      setIsChecking(false);
      return;
    }

    setToken(resetToken);

    const verify = async () => {
      try {
        const resp = await VerifyResetPasswordToken(resetToken);
        if (resp?.status === 'valid') {
          setIsVerified(true);
          setEmail(resp?.email || '');
          setMessage('Your reset link is valid. Please choose a new password.');
        } else {
          setMessage(resp?.message || 'This reset link is invalid or expired.');
        }
      } catch (err) {
        toast.error('Unable to verify reset link right now.');
      } finally {
        setIsChecking(false);
      }
    };

    verify();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const resp = await ChangeUserPassword({
        token,
        newPassword,
      });

      if (resp?.status === 'success') {
        const successMsg = resp?.message || 'Password updated successfully. Redirecting to login...';
        toast.success(successMsg);
        setMessage(successMsg);
        setNewPassword('');
        setConfirmPassword('');
        setIsVerified(false);

        setTimeout(() => {
          window.location.href = '/action';
        }, 2000);
      } else {
        const errorMessage = resp?.message || 'Unable to update password.';
        if (errorMessage.toLowerCase().includes('expired') || errorMessage.toLowerCase().includes('token')) {
          toast.error('Your reset link has expired. Please request a new one. Redirecting you to login...');
          setTimeout(() => {
            window.location.href = '/action';
          }, 2000);
        }
        setMessage(errorMessage);
      }
    } catch (err) {
      toast.error('Unable to update password right now.');
    }
  };

  return (
    <div className="action-container verify-reset-page">
      <div className="signin forgot-password-card auth-panel verify-reset-card">
        <h1>Reset Password</h1>
        {isChecking ? (
          <p className="auth-link verify-reset-msg">Verifying reset link...</p>
        ) : (
          <>
            <p className="auth-link verify-reset-msg">{message}</p>
            {isVerified && (
              <form onSubmit={handleSubmit} className="verify-reset-form">
                {email && (
                  <div className="verify-reset-input-group">
                    <input
                      type="email"
                      value={email}
                      id="reset-email"
                      disabled
                      readOnly
                      className="verify-reset-email-disabled"
                      autoComplete="email"
                    />
                  </div>
                )}
                <div className="verify-reset-input-group">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    id="new-password"
                    autoComplete="new-password"
                  />
                </div>
                <div className="verify-reset-input-group">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirm-password"
                    autoComplete="new-password"
                  />
                </div>
                <button type="submit" id="update-password-btn">Update Password</button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyResetPassword;
