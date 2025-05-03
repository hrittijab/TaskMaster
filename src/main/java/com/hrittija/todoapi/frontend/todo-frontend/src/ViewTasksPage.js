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

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Your Tasks</h2>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.taskId}>{task.taskDescription} - {task.completed ? '✅' : '❌'}</li>
          ))}
        </ul>
      ) : (
        <p>No tasks found.</p>
      )}
      <button onClick={handleBack}>Back to Add Task</button>
    </div>
  );
}

export default ViewTasksPage;
