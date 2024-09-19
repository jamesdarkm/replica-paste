// ResetPassword.jsx
import { useState } from 'react';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  const auth = getAuth();
  const oobCode = searchParams.get('oobCode'); // Get the reset code from the URL

  const handlePasswordReset = async () => {
    if (!oobCode) {
      setError('Invalid or missing reset code.');
      return;
    }
    
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Password has been reset successfully.');
      setError(null);
    } catch (error) {
      setError(error.message);
      setMessage(null);
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {message && <p style={{color: 'green'}}>{message}</p>}
      
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handlePasswordReset}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;
