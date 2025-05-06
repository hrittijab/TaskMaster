import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // ⭐ Add ToastContainer import
import 'react-toastify/dist/ReactToastify.css';  // ⭐ Add Toastify CSS import

import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import AddTaskPage from './AddTaskPage';
import ViewTasksPage from './ViewTasksPage';
import EditTaskPage from './EditTaskPage';
import TaskDetailsPage from './TaskDetailsPage';
import PickBackgroundPage from './PickBackgroundPage';
import VerifyPage from './VerifyPage';

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
        <Route path="/pick-background" element={<PickBackgroundPage />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Routes>
      
      <ToastContainer /> {/* ⭐ ToastContainer added outside Routes */}
    </Router>
  );
}

export default App;
