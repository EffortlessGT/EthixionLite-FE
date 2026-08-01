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
        if (resp?.status === 'success') {
          setIsVerified(true);
          setMessage('Your reset link is valid. Please choose a new password.');
        } else {
          setMessage(resp?.message || 'This reset link is invalid or expired.');
        }
      } catch (err) {
        setMessage('Unable to verify reset link right now.');
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
        confirmNewPassword: confirmPassword,
      });

      if (resp?.status === 'success') {
        toast.success('Password updated successfully.');
        setMessage('Password updated successfully. Please sign in.');
        setNewPassword('');
        setConfirmPassword('');
        setIsVerified(false);
      } else {
        const errorMessage = resp?.message || 'Unable to update password.';
        if (errorMessage.toLowerCase().includes('expired') || errorMessage.toLowerCase().includes('token')) {
          toast.error('Your reset link has expired. Please request a new one.');
        }
        setMessage(errorMessage);
      }
    } catch (err) {
      toast.error('Unable to update password right now.');
    }
  };

  return (
    <div className="action-container">
      <div className="signin forgot-password-card auth-panel">
        <h1>Reset Password</h1>
        {isChecking ? (
          <p className="auth-link">Verifying reset link...</p>
        ) : (
          <>
            <p className="auth-link">{message}</p>
            {isVerified && (
              <form onSubmit={handleSubmit}>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Update Password</button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyResetPassword;
