import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import Navbar from './components/Navbar';
import { useState } from 'react';
import BulkUpload from './components/BulkUpload';
import Login from './components/Login';
import Logout from './components/Logout';
import { AuthProvider } from './contexts/AuthContext';
import Profile from './components/Profile';
import RecipeDetails from './components/RecipeDetails';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  return (
    <AuthProvider setIsAuth={setIsAuth}>
      <Router>
        <Navbar isAuth={isAuth}/>
        <Routes>
          <Route path="/" element={<RecipeList isAuth={isAuth}/>}></Route>
          <Route path="/recipe/" element={<RecipeList isAuth={isAuth}/>}></Route>
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth}/>} />
          <Route path="/logout" element={<Logout setIsAuth={setIsAuth}/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bulk_upload" element={<BulkUpload />}></Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
