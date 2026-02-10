import React from 'react';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/Home';
import DashboardPage from './pages/Dashboard';
// import ProtectedRoutes from './routes/ProtectedRoutes';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";
import TaskManagementPage from './pages/TaskManager';
import PrivateRoute from './components/PrivateRoute';
import EditMyTaskPage from './pages/EditTasks';


function App() {
  return (
  
  <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element ={<HomePage/>}/>
      <Route path="/user-dashboard" element ={<PrivateRoute><DashboardPage/></PrivateRoute>}/>
      <Route path="/user-task-manager" element ={<PrivateRoute><TaskManagementPage/></PrivateRoute>}/>
      <Route path="/user-edit-task-manager" element ={<PrivateRoute><EditMyTaskPage/></PrivateRoute>}/>

     


    </Routes>
      
    </BrowserRouter>
    <ToastContainer/>
   
  </>
    

   
  );
}

export default App;
