import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ViewTasksPage() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/todos/user/${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleBack = () => {
    navigate('/add-task');
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/todos/${taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/todos/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(!currentStatus),
      });
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.taskId === taskId ? { ...task, completed: !currentStatus } : task
          )
        );
      } else {
        console.error('Failed to update task completion');
      }
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>📋 Your Tasks</h1>
      {tasks.length > 0 ? (
        <div style={styles.list}>
          {tasks.map((task) => (
            <div key={task.taskId} style={{ ...styles.card, backgroundColor: task.completed ? '#e6ffe6' : '#ffffff' }}>
              <div style={styles.topRow}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.taskId, task.completed)}
                  style={styles.checkbox}
                />
                <div style={{ flex: 1, textAlign: 'left', marginLeft: '10px' }}>
                  <span style={{ 
                    textDecoration: task.completed ? 'line-through' : 'none', 
                    color: task.completed ? '#4CAF50' : '#333',
                    fontWeight: '500',
                    fontSize: '18px'
                  }}>
                    {task.taskDescription}
                  </span>
                </div>
              </div>
              <div style={styles.actions}>
                <button style={styles.editButton} onClick={() => handleEdit(task.taskId)}>Edit ✏️</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(task.taskId)}>Delete 🗑️</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noTaskText}>No tasks found. Add some!</p>
      )}
      <button style={styles.backButton} onClick={handleBack}>➕ Add New Task</button>
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
    fontSize: '36px',
    marginBottom: '20px',
    color: '#333',
  },
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  },
  card: {
    width: '320px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    width: '22px',
    height: '22px',
    cursor: 'pointer',
  },
  actions: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#1976d2',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  backButton: {
    marginTop: '40px',
    backgroundColor: '#4caf50',
    border: 'none',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  noTaskText: {
    fontSize: '20px',
    marginTop: '30px',
    color: '#777',
  },
};

export default ViewTasksPage;
