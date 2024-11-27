import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';

function App() {
  return (
    <Router>
      {/* <Navbar isAuth={isAuth} /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
