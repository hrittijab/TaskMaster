import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import AddTaskPage from './AddTaskPage';
import ViewTasksPage from './ViewTasksPage';
import EditTaskPage from './EditTaskPage';
import TaskDetailsPage from './TaskDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/add-task" element={<AddTaskPage />} />
        <Route path="/view-tasks" element={<ViewTasksPage />} />
        <Route path="/edit-task/:id" element={<EditTaskPage />} />
        <Route path="/task-details/:id" element={<TaskDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
