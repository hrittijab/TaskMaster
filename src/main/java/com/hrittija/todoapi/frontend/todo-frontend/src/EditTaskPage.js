import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ taskDescription: '', completed: false });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/todos/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTask(data);
        } else {
          console.error('Failed to fetch task');
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [id]);

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
      const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (response.ok) {
        navigate('/view-tasks'); // Go back to view page
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleBack = () => {
    navigate('/view-tasks');
  };

  return (
    <div style={styles.page}>
      <h2>Edit Task</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="taskDescription"
          value={task.taskDescription}
          onChange={handleInputChange}
          style={styles.input}
          placeholder="Task Description"
          required
        />
        <button type="submit" style={styles.saveButton}>Save Changes</button>
      </form>
      <button onClick={handleBack} style={styles.backButton}>Back</button>
    </div>
  );
}

const styles = {
  page: {
    textAlign: 'center',
    marginTop: '50px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    marginTop: '30px',
  },
  input: {
    width: '300px',
    padding: '10px',
    fontSize: '16px',
  },
  saveButton: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  backButton: {
    marginTop: '20px',
    backgroundColor: '#888',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default EditTaskPage;
