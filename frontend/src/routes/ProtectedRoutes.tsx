import { Navigate,Outlet } from "react-router-dom";
import React from "react";



const ProtectedRoutes = () =>{
    const token = localStorage.getItem("token");
    return token ? <Outlet/> : <Navigate to="/" replace/>;

};

export default ProtectedRoutes;