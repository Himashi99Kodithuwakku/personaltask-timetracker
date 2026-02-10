
import { Form ,Modal,Button,Row,Col,Image} from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";


interface LoginModalProps{
    show:boolean;
    handleClose:()=> void;
}

function LoginModal({show,handleClose}: LoginModalProps) {

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
                handleClose();
                navigate("/user-dashboard");
            }
          
        }catch(err:any){
            console.log(err.response?.data || err);
           toast.error(err.response?.data?.message ||"User Login failed");
            

        }
      

    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header  style={{ backgroundColor: 'lightpink', borderColor: 'lightpink', color: 'black' }} closeButton>
            <Modal.Title className='w-100 text-center'>Login</Modal.Title>
            </Modal.Header>

            <Modal.Body >
                <Row>
                    <Col md={6} className='d-flex align-items-center justify-content-center'>
                        <Image src="/images/img02.jpg" fluid/>
                
                    </Col>
                    <Col md={6}>
                         <Form onSubmit ={sendData} style={{width: "350px", margin:"40px auto"}}>
                            
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
                                        right : "40px",
                                        top: "180px",
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
                                        fontWeight: 'normal',
                                        borderRadius:"50px",
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
    
            </Modal.Body>

           
        </Modal>

    );
}

export default LoginModal;