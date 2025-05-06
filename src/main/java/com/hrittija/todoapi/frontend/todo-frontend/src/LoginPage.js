import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // ⭐ import toast

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });

      const result = await response.text(); // ⭐ get the backend response text

      if (response.ok) {
        localStorage.setItem('userEmail', email.toLowerCase());
        toast.success(result); // 🎉 Success toast
        setTimeout(() => navigate('/add-task'), 2000); // 🎯 small delay before navigating
      } else {
        if (response.status === 403) {
          toast.error('Please verify your email before logging in.');
          setTimeout(() => navigate('/verify'), 2000); // 🎯 small delay before navigating to verify
        } else {
          toast.error(result || 'Login failed. Please try again or signup.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
            style={styles.input}
          /><br/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          /><br/>
          <button
            type="submit"
            style={styles.loginButton}
            onMouseOver={(e) => e.target.style.backgroundColor = '#004494'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#0056b3'}
          >
            Login
          </button>
        </form>
        <p style={styles.signupText}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'fadeIn 1s ease-in-out',
  },
  formBox: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
    animation: 'slideUp 1s ease-in-out',
  },
  title: {
    marginBottom: '20px',
    fontSize: '26px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '20px',
    fontSize: '16px',
  },
  loginButton: {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontWeight: '500',
    fontSize: '16px',
    backgroundColor: '#0056b3',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  signupText: {
    marginTop: '20px',
    color: '#555',
    fontSize: '14px',
  },
  link: {
    color: '#0056b3',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default LoginPage;
