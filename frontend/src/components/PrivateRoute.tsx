// src/components/PrivateRoute.tsx
import React, { useEffect, useState } from "react";
import { isTokenExpired, logoutUser } from "../utills/auth";
import { Spinner, Alert } from "react-bootstrap";
import { toast } from 'react-toastify';

interface Props {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
    const [checking, setChecking] = useState(true);
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const checkToken = () => {
            if (isTokenExpired()) {
                setExpired(true);
                setTimeout(() => {
                  toast.error("Session Expired");
                 logoutUser();

                }, 2000); 
            } else {
                setChecking(false);
            }
        };
        checkToken();
    }, []);

    if (checking) {
      
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (expired) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Alert variant="danger">Session expired! Logging out...</Alert>
                <Spinner animation="border" variant="danger" />
            </div>
        );
    }

    return <>{children}</>;
};

export default PrivateRoute;
