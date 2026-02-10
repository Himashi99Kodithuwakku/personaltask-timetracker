
import { Form ,Modal,Button,Row,Col} from 'react-bootstrap';
import { useState ,useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jwtDecode } from "jwt-decode";


interface CreateTaskModalProps{
    show:boolean;
    handleClose:()=> void;
    onTaskAdded?:()=> void;
}

interface TokenPayLoad{
    userId: string;
    email?: string;
}

function CreateTaskModal({show,handleClose,onTaskAdded}: CreateTaskModalProps) {

    const [categories,setCategories] =useState([]);
    const [formTData,setFormTData] =useState({
        task: "",
        dueDate:"",
        categoryId:""
    });


    useEffect(()=>{
        if(show){
            const getCategories = async () => {
                try{
                    const token = localStorage.getItem("token");

                    const res= await axios.get("http://localhost:5011/api/tasks/load-category",{
                        headers:{
                           Authorization:`Bearer ${token}`,
                        },
                    });
                    setCategories(res.data);
                    

                }catch(err){
                    console.error("Failed to load categories",err);

                }
            };
            getCategories();
        }
    },[show]);

    
       // handle input data
    const handleChangeData = (e:any) => {
        setFormTData({
            ...formTData,
            [e.target.name]: e.target.value
        });

    };

    

    const sendTaskData = async(e:any) =>{
        e.preventDefault();

        
       

        if(!formTData.task || !formTData.categoryId ||!formTData.dueDate){
            toast.error("Please fill required fields");
            return;
        }

        try{

            const token = localStorage.getItem("token");
            if(!token){
                toast.error("User not logged in");
                return;
            }

             const decoded = jwtDecode(token) as TokenPayLoad;
            const userId = decoded.userId;

       

            console.log({...formTData,userId});

            const res= await axios.post("http://localhost:5011/api/tasks/add-task",
                formTData,
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                });

            if(res.status === 201){
                toast.success("New Task Added Succssfully");
                handleClose();
                setFormTData({ task: "", dueDate: "", categoryId: "" });

                if(onTaskAdded) {
                    onTaskAdded(); 
                }
     
            }
           

        }catch(err){
            console.error(err);
            toast.error("Failed to add Task");

        
        }

        
    }



    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header  style={{ backgroundColor: 'lightpink', borderColor: 'lightpink', color: 'black' }} closeButton>
            <Modal.Title className='w-100 text-center'>Create New Task</Modal.Title>
            </Modal.Header>

            <Modal.Body >
                 <Form onSubmit={sendTaskData}>
                    <Form.Group className="mb-3 w-100" >
                        <Form.Label>Task </Form.Label>
                        <Form.Control type="text"
                                      placeholder="Enter New Task"
                                      name="task" 
                                      value ={formTData.task}
                                      onChange={handleChangeData}
                                      />
                    </Form.Group>
                    <Row>  
                        <Col md={6}>
                            <Form.Group className="mb-3" >
                                <Form.Label>Due date</Form.Label><br></br>
                                <Form.Control type="date"
                                              name="dueDate"
                                              value ={formTData.dueDate}
                                              onChange={handleChangeData}
                                              />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                             <Form.Group className="mb-3" >
                                <Form.Label>Select Task Type</Form.Label><br></br>
                                   <Form.Select name="categoryId" 
                                                key ={formTData.categoryId}
                                                onChange={handleChangeData}  >

                                        <option value=""> Task Type</option>

                                        {categories.map((cat:any)=>(
                                          <option key={cat.categoryId} value={cat.categoryId} >
                                          {cat.categoryName}
                                          </option>
                                        ))}
                                        
                                    </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row> 

                      <div className='d-flex justify-content-end  mt-3'> 
                            <Button variant="primary" 
                                    type="submit"  
                                    style={{
                                        backgroundColor: 'lightpink',
                                        borderColor: 'lightpink',
                                        color: 'black',  
                                        fontWeight: 'normal',
                                        width:"100px"
                                        
                                    }}
                                    
                                   >
                                Add
                            </Button>
                         
                        </div>
      
                           
                 </Form>

            </Modal.Body>

        </Modal>

    );
}

export default CreateTaskModal;