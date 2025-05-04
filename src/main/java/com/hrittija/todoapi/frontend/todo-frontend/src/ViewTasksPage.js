import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ViewTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [searchText, setSearchText] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dismissedTaskIds, setDismissedTaskIds] = useState([]);
  const [backgroundChoice, setBackgroundChoice] = useState('');
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchUserAndTasks = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        navigate('/login');
        return;
      }
  
      try {
        // Fetch User
        const userResponse = await fetch(`http://localhost:8080/api/users/getUser?email=${encodeURIComponent(userEmail)}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.backgroundChoice) {
            setBackgroundChoice(userData.backgroundChoice);
            localStorage.setItem('backgroundChoice', userData.backgroundChoice);
          }
        }
  
        // Fetch Tasks
        const tasksResponse = await fetch(`http://localhost:8080/api/todos/user/${encodeURIComponent(userEmail)}`);
        if (tasksResponse.ok) {
          const data = await tasksResponse.json();
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks');
        }
  
        const storedDismissed = JSON.parse(localStorage.getItem('dismissedTasks')) || [];
        setDismissedTaskIds(storedDismissed);
  
      } catch (error) {
        console.error('Error fetching user or tasks:', error);
      }
    };
  
    fetchUserAndTasks();
  }, [navigate]);
  

  const handleBack = () => navigate('/add-task');

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/todos/${taskId}`, { method: 'DELETE' });
      if (response.ok) {
        setTasks(prev => prev.filter(task => task.taskId !== taskId));
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (taskId) => navigate(`/edit-task/${taskId}`);
  const handleDetail = (taskId) => navigate(`/task-details/${taskId}`);

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/todos/${taskId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(!currentStatus),
      });
      if (response.ok) {
        setTasks(prev => prev.map(task => (task.taskId === taskId ? { ...task, completed: !currentStatus } : task)));
      } else {
        console.error('Failed to toggle completion');
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const upcomingTasks = tasks.filter(
    task => !task.completed && task.dueDate && task.dueDate <= today && !dismissedTaskIds.includes(task.taskId)
  );

  const dismissNotification = (taskId) => {
    const updatedDismissed = [...dismissedTaskIds, taskId];
    setDismissedTaskIds(updatedDismissed);
    localStorage.setItem('dismissedTasks', JSON.stringify(updatedDismissed));
  };

  const filterTasks = (task) => {
    const matchesFilter = (() => {
      if (filter === 'completed') return task.completed;
      if (filter === 'incomplete') return !task.completed && (!task.dueDate || task.dueDate >= today);
      if (filter === 'overdue') return !task.completed && task.dueDate && task.dueDate < today;
      return true;
    })();
    const matchesSearch = task.taskDescription.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  };

  const sortTasks = (a, b) => {
    if (sortOption === 'dueDateAsc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortOption === 'dueDateDesc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(b.dueDate) - new Date(a.dueDate);
    }
    return 0;
  };

  const getCardColor = (task) => {
    if (task.completed) return '#e6ffe6';
    if (!task.completed && task.dueDate && task.dueDate < today) return '#ffe6e6';
    return '#fffbe6';
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div style={{
      padding: '30px',
      minHeight: '100vh',
      backgroundImage: `url(/backgrounds/${backgroundChoice})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      textAlign: 'center',
    }}>
      <div style={styles.topBar}>
        <h1 style={styles.heading}>📋 Your Tasks</h1>
        <div style={styles.notificationIcon} onClick={() => setNotificationsOpen(!notificationsOpen)}>
          🔔
          {upcomingTasks.length > 0 && (
            <span style={styles.notificationBadge}>{upcomingTasks.length}</span>
          )}
        </div>
      </div>

      <div style={styles.progressBarContainer}>
        <div
          style={{
            ...styles.progressBarFill,
            width: `${progress}%`,
            backgroundColor: progress >= 70 ? '#4caf50' : progress >= 30 ? '#ffc107' : '#f44336',
          }}
        ></div>
      </div>
      <p style={styles.progressText}>
        {completedTasks} of {totalTasks} tasks completed {progress === 100 ? '🎯' : ''}
      </p>

      {notificationsOpen && (
        <div style={styles.notificationPopup}>
          <h4>🔔 Upcoming Tasks</h4>
          {upcomingTasks.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {upcomingTasks.map((task) => (
                <li key={task.taskId} style={styles.notificationItem}>
                  <span>{task.taskDescription} (Due: {task.dueDate})</span>
                  <button onClick={() => dismissNotification(task.taskId)} style={styles.dismissButton}>❌</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming tasks!</p>
          )}
        </div>
      )}

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={styles.searchBox}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.dropdown}>
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
          <option value="overdue">Past Due</option>
        </select>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={styles.dropdown}>
          <option value="default">Sort By</option>
          <option value="dueDateAsc">Due Date ↑</option>
          <option value="dueDateDesc">Due Date ↓</option>
        </select>
      </div>

      {tasks.length > 0 ? (
        <div style={styles.list}>
          {tasks.filter(filterTasks).sort(sortTasks).map((task) => (
            <div key={task.taskId} style={{ ...styles.card, backgroundColor: getCardColor(task) }}>
              <div style={styles.topRow}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.taskId, task.completed)}
                  style={styles.checkbox}
                />
                <div style={{ flex: 1, marginLeft: '10px' }}>
                  <span style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    fontSize: '18px',
                    fontWeight: '500',
                    color: task.completed ? '#4CAF50' : '#333',
                  }}>
                    {task.taskDescription}
                  </span>
                  {task.dueDate && <div style={{ fontSize: '14px', color: '#777' }}>Due: {task.dueDate}</div>}
                </div>
              </div>
              <div style={styles.actions}>
                <button style={styles.detailButton} onClick={() => handleDetail(task.taskId)}>Details 📄</button>
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
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  heading: { fontSize: '36px', color: '#333' },
  notificationIcon: { fontSize: '28px', cursor: 'pointer', position: 'relative' },
  notificationBadge: { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px' },
  progressBarContainer: { height: '10px', width: '90%', margin: '10px auto', backgroundColor: '#ddd', borderRadius: '10px', overflow: 'hidden' },
  progressBarFill: { height: '100%', transition: 'width 0.4s ease-in-out' },
  progressText: { fontSize: '16px', color: '#555', marginBottom: '20px' },
  notificationPopup: { position: 'absolute', right: '20px', top: '80px', backgroundColor: 'white', boxShadow: '0px 2px 10px rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', zIndex: '1000', width: '280px' },
  notificationItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  dismissButton: { background: 'none', border: 'none', color: 'red', fontSize: '18px', cursor: 'pointer' },
  controls: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  searchBox: { padding: '10px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', width: '250px' },
  dropdown: { padding: '10px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', width: '180px' },
  list: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' },
  card: { width: '320px', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', transition: 'transform 0.3s' },
  topRow: { display: 'flex', alignItems: 'center' },
  checkbox: { width: '22px', height: '22px', cursor: 'pointer' },
  actions: { marginTop: '20px', display: 'flex', justifyContent: 'space-between' },
  detailButton: { backgroundColor: '#17a2b8', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  editButton: { backgroundColor: '#1976d2', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  deleteButton: { backgroundColor: '#d32f2f', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  backButton: { marginTop: '40px', backgroundColor: '#4caf50', border: 'none', color: 'white', padding: '12px 24px', borderRadius: '8px', fontSize: '18px', cursor: 'pointer' },
  noTaskText: { fontSize: '20px', marginTop: '30px', color: '#777' },
};

export default ViewTasksPage;
