import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BASE_URL from './config'; // ⭐ Import BASE_URL

function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [backgroundChoice, setBackgroundChoice] = useState('default.jpg');

  useEffect(() => {
    const fetchTaskAndBackground = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        toast.error('User not logged in.');
        navigate('/login');
        return;
      }

      try {
        // ⭐ Fetch task notes with BASE_URL
        const taskResponse = await fetch(`${BASE_URL}/api/todos/${id}`);
        if (taskResponse.ok) {
          const data = await taskResponse.json();
          setNotes(data.notes || 'No notes available.');
        } else {
          console.error('Failed to fetch notes');
          toast.error('Failed to fetch task notes.');
        }

        // ⭐ Fetch user background with BASE_URL
        const userResponse = await fetch(`${BASE_URL}/api/users/getUser?email=${encodeURIComponent(userEmail)}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const background = userData.backgroundChoice || 'default.jpg';
          setBackgroundChoice(background);
          localStorage.setItem('backgroundChoice', background);
        } else {
          console.error('Failed to fetch background choice');
          toast.error('Failed to fetch background settings.');
        }
      } catch (error) {
        console.error('Error fetching task or background:', error);
        toast.error('An unexpected error occurred.');
      }
    };

    fetchTaskAndBackground();
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/view-tasks');
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: '30px',
      backgroundImage: `url(/backgrounds/${backgroundChoice})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }}>
      <h2>📝 Task Notes</h2>
      <div style={styles.taskBox}>
        <div style={styles.notesBox}>
          {notes}
        </div>
        <button onClick={handleBack} style={styles.backButton}>🔙 Back</button>
      </div>
    </div>
  );
}

const styles = {
  taskBox: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '600px',
    margin: '20px auto',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
  },
  notesBox: {
    width: '100%',
    minHeight: '250px',
    marginTop: '20px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    textAlign: 'left',
    whiteSpace: 'pre-wrap',
  },
  backButton: {
    marginTop: '20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default TaskDetailsPage;
