import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BASE_URL from './config'; // ⭐ Import BASE_URL

function AddTaskPage() {
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [taskAdded, setTaskAdded] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [backgroundChoice, setBackgroundChoice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      toast.error('User not logged in.');
      navigate('/login');
    } else {
      fetch(`${BASE_URL}/api/users/getUser?email=${encodeURIComponent(userEmail)}`) // ⭐ Use BASE_URL
        .then((res) => res.json())
        .then((data) => {
          setFirstName(data.firstName || '');
          if (data.backgroundChoice) {
            setBackgroundChoice(data.backgroundChoice);
            localStorage.setItem('backgroundChoice', data.backgroundChoice);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch user info:', err);
          toast.error('Failed to fetch user info.');
        });
    }
  }, [navigate]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskDescription.trim() || !dueDate) {
      toast.warning('Please enter both task description and due date.');
      return;
    }

    const userEmail = localStorage.getItem('userEmail');

    try {
      const response = await fetch(`${BASE_URL}/api/todos`, { // ⭐ Use BASE_URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskDescription, userEmail, dueDate, notes }),
      });

      if (response.ok) {
        setTaskDescription('');
        setDueDate('');
        setNotes('');
        setTaskAdded(true);
        toast.success('Task added successfully!');
      } else {
        console.error('Failed to add task');
        toast.error('Failed to add task.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const handleViewTasks = () => {
    navigate('/view-tasks');
  };

  const handlePickBackground = () => {
    navigate('/pick-background');
  };

  return (
    <div style={{
      ...styles.container,
      backgroundImage: `url(/backgrounds/${backgroundChoice})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div style={styles.formBox}>
        {firstName && <h2 style={styles.welcome}>Welcome, {firstName}!</h2>}
        <h3 style={styles.title}>Add a New Task</h3>

        <button onClick={handlePickBackground} style={styles.pickButton}>🎨 Customize Background</button>

        {!taskAdded ? (
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="Enter task description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
              style={styles.input}
            /><br />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              style={styles.input}
            /><br />
            <textarea
              placeholder="Add notes for the task (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              style={{ ...styles.input, height: '100px', resize: 'none' }}
            /><br />
            <button type="submit" style={styles.addButton}>Add Task</button><br />
            <button type="button" onClick={handleViewTasks} style={styles.viewButton}>View Tasks</button><br />
            <button type="button" onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </form>
        ) : (
          <>
            <h4 style={styles.success}>Task added successfully!</h4>
            <button onClick={handleViewTasks} style={styles.viewButton}>View Tasks</button><br />
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBox: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  welcome: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#0077b6',
    marginBottom: '10px',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
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
  pickButton: {
    backgroundColor: '#17a2b8',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  addButton: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#0056b3',
    color: 'white',
    fontSize: '16px',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  viewButton: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#6c757d',
    color: 'white',
    fontSize: '16px',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  logoutButton: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#c82333',
    color: 'white',
    fontSize: '16px',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  success: {
    color: 'green',
    fontWeight: '500',
    marginBottom: '20px',
  },
};

export default AddTaskPage;
