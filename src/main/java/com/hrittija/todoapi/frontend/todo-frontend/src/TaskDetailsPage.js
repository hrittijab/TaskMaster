import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchTaskNotes = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/todos/${id}`);
        if (response.ok) {
          const data = await response.json();
          setNotes(data.notes || 'No notes available.');
        } else {
          console.error('Failed to fetch notes');
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchTaskNotes();
  }, [id]);

  const handleBack = () => {
    navigate('/view-tasks');
  };

  return (
    <div style={styles.page}>
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
  page: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
  },
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
    whiteSpace: 'pre-wrap', // preserve line breaks
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
