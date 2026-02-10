import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import Navbar from 'react-bootstrap/Navbar';
import RegisterModal from './modals/RegisterModal';
import { useState ,useEffect} from 'react';
import LoginModal from './modals/LoginModal';
import { useNavigate } from 'react-router-dom';


function HomeNavbar() {

   
  const [showRegister,setShowRegister]  = useState(false);
  const [showLogin,setShowLogin]  = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 
  useEffect(()=>{
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  },[showLogin]);

  const openRegister = () => {
    setShowRegister(true);
  }

  const closeRegister = () => {
    setShowRegister(false);
  }

  const openLogin = () => {
    setShowLogin(true);
  }

  const closeLogin= () => {
    setShowLogin(false);
  }

  const userLogout =() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  }


  return (
    <>
      <Navbar expand="lg" fixed="top" className= "bg-lightpink">
        <Container fluid>
            <Navbar.Brand className='mx-2 fw-bold' href="#">Task Manager</Navbar.Brand>
            <Navbar.Toggle aria-controls='navbarScroll'></Navbar.Toggle>
            <Navbar.Collapse id="navbarScroll" className='justify-content-end'>
            <div className='d-flex'>
                {isLoggedIn ? (
                    <>
                        
                        <Button variant="dark" className="mx-2" onClick={userLogout} style={{width:"100px", borderRadius:"50px" ,fontWeight:"bold" }}>Logout</Button>
                    </>
                ) : ( 

                
                    <>
                        <Button variant="dark" className="mx-2" onClick={openRegister} style={{width:"100px", borderRadius:"50px" ,fontWeight:"bold"}}>Register </Button>
                        <Button variant="dark" className="mx-2" onClick={openLogin} style={{width:"100px", borderRadius:"50px" ,fontWeight:"bold" }}>Login</Button>
                    </>
                )}
                


            </div>

            </Navbar.Collapse>
        </Container>
      </Navbar>
      <RegisterModal show={showRegister} handleClose={closeRegister}/>
      <LoginModal show={showLogin} handleClose={closeLogin}/>
    </>
   


  );
}

export default HomeNavbar;