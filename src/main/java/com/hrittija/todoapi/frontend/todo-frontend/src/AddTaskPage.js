import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddTaskPage() {
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [taskAdded, setTaskAdded] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [backgroundChoice, setBackgroundChoice] = useState('');
  const navigate = useNavigate();

  const backgrounds = [
    { name: 'Beach', url: 'beach.jpg' },
    { name: 'Coffee Lover', url: 'coffeelover.jpg' },
    { name: 'Flight View', url: 'flightview.jpg' },
    { name: 'Forest', url: 'forest.jpg' },
    { name: 'Gym', url: 'gym.jpg' },
    { name: 'Harry Potter', url: 'harrypotter.jpg' },
    { name: 'Library', url: 'library.jpg' },
    { name: 'Mountain', url: 'mountain.jpg' },
    { name: 'Party', url: 'party.jpg' },
    { name: 'Pink', url: 'pink.jpg' },
    { name: 'Sunrise', url: 'sunrise.jpg' },
  ];

  useEffect(() => {
    console.log('PAGE MOUNT: Loading backgroundChoice from localStorage first.');
    const storedBackground = localStorage.getItem('backgroundChoice') || 'default.jpg';
    setBackgroundChoice(storedBackground);
    console.log('Local backgroundChoice loaded at mount:', storedBackground);

    const userEmail = localStorage.getItem('userEmail');
    console.log('Checking userEmail:', userEmail);

    if (!userEmail) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:8080/api/users/getUser?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched user data:', data);

        if (data.backgroundChoice) {
          console.log('Setting backgroundChoice from backend:', data.backgroundChoice);
          localStorage.setItem('backgroundChoice', data.backgroundChoice);
          setBackgroundChoice(data.backgroundChoice);
        }
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
      });
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
        body: JSON.stringify({ taskDescription, userEmail, dueDate, notes }),
      });

      if (response.ok) {
        setTaskDescription('');
        setDueDate('');
        setNotes('');
        setTaskAdded(true);
      } else {
        alert('Failed to add task.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleViewTasks = () => {
    navigate('/view-tasks');
  };

  const handlePickBackground = async (selectedBackground) => {
    const userEmail = localStorage.getItem('userEmail');
    console.log('User selected new background:', selectedBackground);

    try {
      const response = await fetch(`http://localhost:8080/api/users/${encodeURIComponent(userEmail)}/background`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedBackground),
      });

      if (response.ok) {
        console.log('Background updated on server!');
        localStorage.setItem('backgroundChoice', selectedBackground);
        setBackgroundChoice(selectedBackground);
      } else {
        console.error('Failed to save background');
      }
    } catch (error) {
      console.error('Error updating background:', error);
    }
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

        <div>
          <h4>Pick Your Background:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            {backgrounds.map(bg => (
              <img
                key={bg.name}
                src={`/backgrounds/${bg.url}`}
                alt={bg.name}
                style={{
                  width: '80px',
                  height: '60px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  border: backgroundChoice === bg.url ? '3px solid #0077b6' : '2px solid #ccc',
                  objectFit: 'cover',
                }}
                onClick={() => handlePickBackground(bg.url)}
              />
            ))}
          </div>
        </div>

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
