import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to Todo App</h1>
      <Link to="/login"><button>Login</button></Link>
      <Link to="/signup"><button>Signup</button></Link>
    </div>
  );
}

export default HomePage;
