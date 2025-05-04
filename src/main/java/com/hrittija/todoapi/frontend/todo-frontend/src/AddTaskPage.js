import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddTaskPage() {
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState(''); // ✅ New state for due date
  const [taskAdded, setTaskAdded] = useState(false);
  const [firstName, setFirstName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      navigate('/login');
    } else {
      fetch(`http://localhost:8080/api/users/getUser?email=${encodeURIComponent(userEmail)}`)
        .then((res) => res.json())
        .then((data) => {
          setFirstName(data.firstName || '');
        })
        .catch((err) => console.error('Failed to fetch user info:', err));
    }
  }, [navigate]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskDescription.trim() || !dueDate) {
      alert('Please enter both task description and due date.');
      return;
    }

    const userEmail = localStorage.getItem('userEmail');

    try {
      const response = await fetch('http://localhost:8080/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskDescription, userEmail, dueDate }), // ✅ send dueDate also
      });

      if (response.ok) {
        setTaskDescription('');
        setDueDate('');
        setTaskAdded(true);
      } else {
        alert('Failed to add task.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleViewTasks = () => {
    navigate('/view-tasks');
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        {firstName && <h2 style={styles.welcome}>Welcome, {firstName}!</h2>}
        <h3 style={styles.title}>Add a New Task</h3>

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
              type="date" // ✅ this shows a calendar
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              style={styles.input}
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
    background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
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
