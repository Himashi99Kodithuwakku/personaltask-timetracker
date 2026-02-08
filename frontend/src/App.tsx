import React from 'react';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/Home';
import DashboardPage from './pages/Dashboard';
import ProtectedRoutes from './routes/ProtectedRoutes';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";


function App() {
  return (
  
  <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element ={<HomePage/>}/>
      <Route element ={ <ProtectedRoutes/>}>
      <Route path="/user-dashboard" element ={<DashboardPage/>}/>

      </Route>


    </Routes>
      
    </BrowserRouter>
    <ToastContainer/>
   
  </>
    

   
  );
}

export default App;
