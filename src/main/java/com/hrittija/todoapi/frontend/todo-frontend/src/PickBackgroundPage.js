import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BASE_URL from './config'; // ⭐ Import BASE_URL


function PickBackgroundPage() {
  const [backgrounds] = useState([
    { name: 'Beach', url: 'beach.jpg', description: 'Relaxing beach view' },
    { name: 'Coffee Lover', url: 'coffeelover.jpg', description: 'Cozy coffee time' },
    { name: 'Flight View', url: 'flightview.jpg', description: 'Sky view from plane' },
    { name: 'Forest', url: 'forest.jpg', description: 'Peaceful green forest' },
    { name: 'Gym', url: 'gym.jpg', description: 'Motivation in gym' },
    { name: 'Harry Potter', url: 'harrypotter.jpg', description: 'Magical Harry Potter world' },
    { name: 'Library', url: 'library.jpg', description: 'Quiet library environment' },
    { name: 'Mountain', url: 'mountain.jpg', description: 'Snowy mountains' },
    { name: 'Party', url: 'party.jpg', description: 'Fun party vibes' },
    { name: 'Pink', url: 'pink.jpg', description: 'Cute pink theme' },
    { name: 'Sunrise', url: 'sunrise.jpg', description: 'Beautiful sunrise' },
  ]);
  const [selectedBackground, setSelectedBackground] = useState('');
  const navigate = useNavigate();

  const handleBackgroundSelect = async (backgroundUrl) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      toast.error('User not logged in.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/users/${encodeURIComponent(userEmail)}/background`, { // ⭐ Use BASE_URL
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backgroundUrl),
      });

      if (response.ok) {
        toast.success('Background updated!');
        localStorage.setItem('backgroundChoice', backgroundUrl);
        setSelectedBackground(backgroundUrl);
        setTimeout(() => navigate('/add-task'), 2000);
      } else {
        console.error('Failed to save background');
        toast.error('Failed to save background.');
      }
    } catch (error) {
      console.error('Error updating background:', error);
      toast.error('Error updating background.');
    }
  };

  const handleBack = () => {
    navigate('/add-task');
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Pick Your Background</h2>
      <div style={styles.gallery}>
        {backgrounds.map((bg) => (
          <div key={bg.name} style={styles.card}>
            <img
              src={`/backgrounds/${bg.url}`}
              alt={bg.name}
              style={{
                ...styles.image,
                border: selectedBackground === bg.url ? '3px solid #0077b6' : '2px solid #ccc',
              }}
              onClick={() => handleBackgroundSelect(bg.url)}
            />
            <p style={styles.description}>{bg.description}</p>
          </div>
        ))}
      </div>
      <button onClick={handleBack} style={styles.backButton}>🔙 Back</button>
    </div>
  );
}

const styles = {
  page: {
    padding: '30px',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '30px',
    fontSize: '26px',
    color: '#333',
  },
  gallery: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  },
  card: {
    width: '180px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  description: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#555',
  },
  backButton: {
    marginTop: '30px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default PickBackgroundPage;
