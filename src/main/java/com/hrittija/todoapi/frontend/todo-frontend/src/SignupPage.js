import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(getPasswordStrength(newPassword));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (passwordStrength < 4) {
      alert("Password not strong enough.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName, passwordHash: password }),
      });

      if (response.ok) {
        alert('Signup successful!');
        navigate('/login');
      } else {
        alert('Signup failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Sign Up</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
          style={styles.input}
        />

        {/* Password Strength Bar */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            height: '8px',
            width: '100%',
            backgroundColor: '#eee',
            borderRadius: '5px',
            overflow: 'hidden',
            marginTop: '5px'
          }}>
            <div style={{
              height: '100%',
              width: `${(passwordStrength / 4) * 100}%`,
              backgroundColor:
                passwordStrength <= 1 ? 'red' :
                passwordStrength === 2 ? 'orange' :
                passwordStrength === 3 ? 'yellowgreen' : 'green',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <small style={{ color: passwordStrength === 4 ? 'green' : 'red' }}>
            {password.length === 0
              ? 'Password must be 8+ chars, capital, number, special symbol.'
              : passwordStrength === 4
              ? 'Strong password ✅'
              : 'Weak password ⚠️'}
          </small>
        </div>

        <button type="submit" style={styles.signupButton}>Sign Up</button>

        {/* ✨ New Login Button */}
        <p style={{ marginTop: '20px' }}>
          Already have an account?{' '}
          <button onClick={goToLogin} style={styles.loginLink}>Log In</button>
        </p>

      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    padding: '20px',
  },
  heading: {
    color: '#003366',
    marginBottom: '20px',
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: '400px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '15px',
    fontSize: '16px',
  },
  signupButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  loginLink: {
    background: 'none',
    border: 'none',
    color: '#1976d2',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default SignUpPage;
