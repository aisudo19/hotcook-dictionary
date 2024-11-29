import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import Navbar from './components/Navbar';
import { useState } from 'react';
import GetCookedRecipes from './components/GetCookedRecipes';
import WantRecipes from './components/WantRecipes';
import BulkUpload from './components/BulkUpload';

function App() {
  // const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [isAuth, setIsAuth] = useState(false);

  return (
    <Router>
      <Navbar isAuth={isAuth}/>
      <Routes>
        <Route path="/" element={<RecipeList />}></Route>
        <Route path="/want" element={<WantRecipes />}></Route>
        <Route path="/experienced" element={<GetCookedRecipes />}></Route>
        <Route path="/bulk_upload" element={<BulkUpload />}></Route>
        {/* <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
