import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import Navbar from './components/Navbar';
import { useState } from 'react';
import BulkUpload from './components/BulkUpload';
import Login from './components/Login';
import Logout from './components/Logout';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  return (
    <Router>
      <Navbar isAuth={isAuth}/>
      <Routes>
        <Route path="/" element={<RecipeList isAuth={isAuth}/>}></Route>
        <Route path="/login" element={<Login setIsAuth={setIsAuth}/>} />
        <Route path="/logout" element={<Logout setIsAuth={setIsAuth}/>} />
        <Route path="/bulk_upload" element={<BulkUpload />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
