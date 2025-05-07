import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BASE_URL from './config'; // ⭐ Import BASE_URL

function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    taskDescription: '',
    dueDate: '',
    notes: '',
    completed: false,
  });
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
        // ⭐ Fetch task using BASE_URL
        const taskResponse = await fetch(`${BASE_URL}/api/todos/${id}`);
        if (taskResponse.ok) {
          const data = await taskResponse.json();
          setTask(data);
        } else {
          console.error('Failed to fetch task');
          toast.error('Failed to fetch task.');
        }

        // ⭐ Fetch user background using BASE_URL
        const userResponse = await fetch(`${BASE_URL}/api/users/getUser?email=${encodeURIComponent(userEmail)}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const background = userData.backgroundChoice || 'default.jpg';
          setBackgroundChoice(background);
          localStorage.setItem('backgroundChoice', background);
        } else {
          console.error('Failed to fetch user background');
          toast.error('Failed to fetch user background.');
        }
      } catch (error) {
        console.error('Error fetching task or background:', error);
        toast.error('An error occurred. Please try again.');
      }
    };

    fetchTaskAndBackground();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/todos/${id}`, { // ⭐ Use BASE_URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (response.ok) {
        toast.success('Task updated successfully!');
        navigate('/view-tasks');
      } else {
        console.error('Failed to update task');
        toast.error('Failed to update task.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('An error occurred while updating the task.');
    }
  };

  const handleBack = () => {
    navigate('/view-tasks');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(/backgrounds/${backgroundChoice})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    }}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Task</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="taskDescription"
            value={task.taskDescription}
            onChange={handleInputChange}
            placeholder="Task Description"
            style={styles.input}
            required
          />
          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleInputChange}
            style={styles.input}
          />
          <textarea
            name="notes"
            value={task.notes}
            onChange={handleInputChange}
            placeholder="Notes about the task..."
            rows="4"
            style={styles.textarea}
          />
          <button type="submit" style={styles.saveButton}>Save Changes</button>
          <button type="button" onClick={handleBack} style={styles.backButton}>Back</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '40px 30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  textarea: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    resize: 'none',
    height: '120px',
    transition: 'border-color 0.3s',
  },
  saveButton: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  backButton: {
    backgroundColor: '#888',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default EditTaskPage;
