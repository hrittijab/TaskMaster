import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddTaskPage() {
  const [taskDescription, setTaskDescription] = useState('');
  const [taskAdded, setTaskAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      navigate('/login'); // Force login if no email stored
    }
  }, [navigate]);

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!taskDescription.trim()) return;

    const userEmail = localStorage.getItem('userEmail'); 

    try {
      const response = await fetch('http://localhost:8080/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskDescription,
          userEmail,
        }),
      });

      if (response.ok) {
        setTaskDescription('');
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
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Add a New Task</h2>
      {!taskAdded ? (
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Enter task description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          /><br/><br/>
          <button type="submit">Add Task</button><br/><br/>
          <button type="button" onClick={handleViewTasks}>View Tasks</button><br/><br/>
          <button type="button" onClick={handleLogout}>Logout</button>
        </form>
      ) : (
        <>
          <h3>Task added successfully!</h3>
          <button onClick={handleViewTasks}>View Tasks</button><br/><br/>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default AddTaskPage;
