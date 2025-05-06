import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // ⭐ Add toast import

function VerifyPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/users/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const result = await response.text(); // ⭐ Read backend message

      if (response.ok) {
        toast.success('Email verified successfully! You can now log in.'); // 🎉 Toast
        setTimeout(() => navigate('/login'), 2000); // ⏳ Delay before navigation
      } else {
        toast.error(result || 'Verification failed. Please try again.'); // ❗ Error Toast
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>Verify Your Email</h2>
        <form onSubmit={handleVerify}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          /><br/>
          <input
            type="text"
            placeholder="6-digit Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            style={styles.input}
            maxLength="6"
          /><br/>
          <button
            type="submit"
            style={styles.verifyButton}
            onMouseOver={(e) => e.target.style.backgroundColor = '#004494'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#0056b3'}
          >
            Verify Email
          </button>
        </form>
        <p style={styles.loginText}>
          Already verified?{' '}
          <Link to="/login" style={styles.link}>
            Login here
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
  verifyButton: {
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
  loginText: {
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

export default VerifyPage;
