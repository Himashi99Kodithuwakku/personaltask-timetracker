
import { Form ,Modal,Button,Row,Col,Image} from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";

interface RegisterModalProps{
    show:boolean;
    handleClose:()=> void;
}

function RegisterModal({show,handleClose}: RegisterModalProps) {

    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState(
        {
         username:"",
         email:"",
         password:"",
         confirmPassword:""
        });

   // handle input data
    const handleChangeData = (e:any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validatePassword = (password:string) =>{
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
        return passwordRegex.test(password);
    }
  // submit form data to backend
    
    const sendData = async (e:any) =>{
        e.preventDefault();

        console.log("Form Data Submitted:", formData);

        if(!formData.username.trim()){
            toast.error("Please enter username");
            return;
        }

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
           toast.error(" please enter new password");
            return;
        }

        if(!validatePassword(formData.password)){
            toast.error("Password must be at least 10 characters and include upper case, lowercase, number and special character");
            return;
        }

        if(!formData.confirmPassword){
            toast.error(" please enter confirm password");
            return;
        }


        if(formData.password !== formData.confirmPassword){
            toast.error("Passwords do not match, enter correct password again");
            return;
        }

        

        try{

            const res = await axios.post("http://localhost:5011/api/auth/user-register",{
                username:formData.username,
                email:formData.email,
                password:formData.password
            });

            if(res.status === 201){
                  toast.success("User Registered Successfully");
                  handleClose();
            }
          
        }catch(err:any){
            console.log(err.response?.data || err);
            toast.error(err.response?.data?.message ||"User registered failed");
            

        }
      

    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header  style={{ backgroundColor: 'lightpink', borderColor: 'lightpink', color: 'black' }} closeButton>
            <Modal.Title className='w-100 text-center'>Register</Modal.Title>
            </Modal.Header>

            <Modal.Body >
                <Row>
                    <Col md={6} className='d-flex align-items-center justify-content-center'>
                        <Image src="/images/img01.jpg" fluid/>
                
                    </Col>
                    <Col md={6}>
                         <Form onSubmit ={sendData} style={{width: "350px", margin:"40px auto"}}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text"
                                              placeholder="Enter username"
                                              name="username" 
                                              onChange={handleChangeData}/>
                            </Form.Group>

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
                                              placeholder="Cretae a New Password" 
                                              name="password" 
                                              onChange={handleChangeData}/>

                                <span style={{
                                        position : "absolute",
                                        right : "40px",
                                        top: "265px",
                                        cursor: "pointer"  }}
                                        onClick ={()=>setShowPassword(!showPassword)}  >
                                <FontAwesomeIcon icon={showPassword ? faEye :faEyeSlash}/>

                                </span>
                                 <Form.Text className="text-muted fw-lighter">
                                 Minimum 10  characters with Uppercase, lowecase, numbers and special characters.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type={showConfirmPassword ? "text" : "password"}
                                              placeholder="Enter Confirm Password"
                                              name="confirmPassword" 
                                              onChange={handleChangeData}/>

                                <span style={{
                                        position : "absolute",
                                        right : "40px",
                                        top: "400px",
                                        cursor: "pointer"  }}
                                        onClick ={()=>setShowConfirmPassword(!showConfirmPassword)}  >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEye :faEyeSlash}/>

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
                                Register
                            </Button>

                            </div>
                          
                        </Form>
                    </Col>
                </Row>
    
            </Modal.Body>

           
        </Modal>

    );
}

export default RegisterModal;