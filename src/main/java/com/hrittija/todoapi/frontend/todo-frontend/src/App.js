import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import AddTaskPage from './AddTaskPage';
import ViewTasksPage from './ViewTasksPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/add-task" element={<AddTaskPage />} />
        <Route path="/view-tasks" element={<ViewTasksPage />} />
      </Routes>
    </Router>
  );
}

export default App;
