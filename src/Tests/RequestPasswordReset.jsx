// RequestPasswordReset.jsx
import { useState } from 'react';
import { sendCustomPasswordResetLink } from './firebasePasswordReset';

function RequestPasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      await sendCustomPasswordResetLink(email);
      setMessage('Reset link has been sent to your email');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Request Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RequestPasswordReset;
