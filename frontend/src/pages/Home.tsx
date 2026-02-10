
import HomeNavbar from "../components/Navbar";
import { Container,Row,Col,Button,Image,Form } from "react-bootstrap";
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";


export default function HomePage(){

    const [showPassword,setShowPassword] = useState(false);
    const navigate = useNavigate();
   

    const [formData, setFormData] = useState(
        {
         email:"",
         password:"",
        });

   // handle input data
    const handleChangeData = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


  // submit form data to backend
    
    const sendData = async (e:any) =>{
        e.preventDefault();

        console.log("Form Data Submitted:", formData);


         if(!formData.email.trim()){
            toast.error("Please enter email");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(formData.email)){
            toast.error("Please enter a valid email address");
            return;
        }

        if(!formData.password){
            toast.error(" please enter password");
            return;
        }

        

        try{
            const res = await axios.post("http://localhost:5011/api/auth/user-login",{
                email:formData.email,
                password:formData.password
            });

            if(res.status === 200){
                localStorage.setItem("token",res.data.token) ; 
                toast.success("User Logged in Successfully");
                navigate("/user-dashboard");
            }
          
        }catch(err:any){
            console.log(err.response?.data || err);
           toast.error(err.response?.data?.message ||"User Login failed");
            

        }
      

    };

 
    
    return  (
        <>
        <HomeNavbar/>

        <Container fluid className="vh-100 d-flex align-items-center justify-content-center"style={{ background: "linear-gradient(135deg, #0f0c29, #1b1217, #51313f)"}} >
            <div  style={{backgroundColor:"white",width:"600px", height:"300px", borderRadius:"5px", padding:"20px", boxShadow:"0 0 20px rgba(0,0,0,0.3"}}>
                  <Row>
                    <Col md={6} className='d-flex align-items-center justify-content-center'>
                        <Image src="/images/img02.jpg" fluid/>
                
                    </Col>
                    <Col md={6}>
                         <Form onSubmit ={sendData} style={{width: "250px", margin:"40px auto"}}>
                            
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email"
                                              placeholder="Enter email"
                                              name="email" 
                                              onChange={handleChangeData} />
                                
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label><br></br>
                                <Form.Control type={showPassword ? "text" : "password"}
                                              placeholder="Enter Password" 
                                              name="password" 
                                              onChange={handleChangeData}/>

                                <span style={{
                                        position : "absolute",
                                        right : "510px",
                                        top: "380px",
                                        cursor: "pointer"  }}
                                        onClick ={()=>setShowPassword(!showPassword)}  >
                                <FontAwesomeIcon icon={showPassword ? faEye :faEyeSlash}/>

                                </span>
                             
                            </Form.Group>

                            <div className='d-flex justify-content-center mt-3'> 
                            <Button variant="primary" 
                                    type="submit"  
                                    style={{
                                        backgroundColor: 'lightpink',
                                        borderColor: 'lightpink',
                                        color: 'black',
                                        width: '200px',
                                        borderRadius:"50px",   
                                        fontWeight: 'normal',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.fontWeight = 'bold')}
                                    onMouseLeave={e => (e.currentTarget.style.fontWeight = 'normal')} >
                                Login
                            </Button>

                            </div>
                          
                        </Form>
                    </Col>
                </Row>
            </div>

        </Container>

       
  
         </>

       
   );
  
     
}