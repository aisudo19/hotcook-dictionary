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
import SavedMealPlans from './components/SavedMealPlans';
import SavedMealPlanLists from './components/SavedMealPlanLists';
import AddRecipe from './components/AddRecipe';
import FoodList from './components/FoodList';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  return (
    <AuthProvider setIsAuth={setIsAuth}>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<RecipeList isAuth={isAuth}/>}></Route>
          <Route path="/recipe/" element={<RecipeList isAuth={isAuth}/>}></Route>
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/saved-meal-plans/:id" element={<SavedMealPlans />} />
          <Route path="/saved-meal-plan-lists" element={<SavedMealPlanLists />} />
          <Route path="/new_recipe" element={<AddRecipe />} />
          <Route path="/food-list" element={<FoodList />} />
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
