import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import Navbar from './components/Navbar';
import { useState } from 'react';

function App() {
  // const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [isAuth, setIsAuth] = useState(false);

  return (
    <Router>
      <Navbar isAuth={isAuth}/>
      <Routes>
        <Route path="/" element={<RecipeList />}></Route>
        {/* <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
