import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={styles.container}>
      <div style={styles.heroBox}>
        <h1 style={styles.title}>Welcome to Your To-Do World 🌟</h1>
        <p style={styles.subtitle}>Organize your tasks, boost your productivity, and conquer your day!</p>

        <div style={styles.buttonContainer}>
          <Link to="/login">
            <button style={{ ...styles.button, ...styles.loginButton }}>Login</button>
          </Link>
          <Link to="/signup">
            <button style={{ ...styles.button, ...styles.signupButton }}>Signup</button>
          </Link>
        </div>
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
    animation: 'fadeIn 1s ease-in',
  },
  heroBox: {
    backgroundColor: 'white',
    padding: '50px',
    borderRadius: '16px',
    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    width: '90%',
    maxWidth: '500px',
    animation: 'slideUp 1s ease-out',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#333',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  loginButton: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  signupButton: {
    backgroundColor: '#28a745',
    color: 'white',
  }
};

export default HomePage;
