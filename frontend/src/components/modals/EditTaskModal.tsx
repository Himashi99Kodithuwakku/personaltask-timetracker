
import { Form ,Modal,Button,Row,Col} from 'react-bootstrap';
import { useState ,useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jwtDecode } from "jwt-decode";


interface EditTaskModalProps{
    show:boolean;
    handleClose:()=> void;
    onTaskAdded?:()=> void;
    task:any | null;
    onTaskUpdated?: ()=> void;

}

interface TokenPayLoad{
    userId: string;
    email?: string;
}

interface Category {
  categoryId: string;
  categoryName: string;
}

function EditTaskModal({show,handleClose,onTaskAdded,task}: EditTaskModalProps) {

    const [categories, setCategories] = useState<Category[]>([]);

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


    useEffect(() => {
        if (show && task && categories.length > 0) {
            const matchedCategory = categories.find(
            (cat) => cat.categoryName === task.categoryname
            );

        setFormTData({
            task: task.task_text,
            dueDate: task.due_date ? task.due_date.split("T")[0] : "",
            categoryId: matchedCategory?.categoryId || "",
        });
    }
    }, [show, task, categories]);
    

    console.log("TASK OBJECT:", task);


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

            const res= await axios.put(`http://localhost:5011/api/tasks/update-task/${task.taskid}`,
                formTData,
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                });

            if(res.status === 200){
                toast.success("Task Updated Succssfully");
                handleClose();
                setFormTData({ task: "", dueDate: "", categoryId: "" });

                if(onTaskAdded) {
                    onTaskAdded(); 
                }
     
            }
           

        }catch(err){
            console.error(err);
            toast.error("Failed to Edit Task");

        
        }

        
    }



    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header  style={{ backgroundColor: 'lightpink', borderColor: 'lightpink', color: 'black' }} closeButton>
            <Modal.Title className='w-100 text-center'>Edit Task </Modal.Title>
            </Modal.Header>

            <Modal.Body >
                 <Form onSubmit={sendTaskData}>
                    <Form.Group className="mb-3 w-100" >
                        <Form.Label>Task </Form.Label>
                        <Form.Control type="text"
                                      placeholder="Edit Task"
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
                                                value ={formTData.categoryId}
                                                onChange={handleChangeData}  >

                                        <option value=""> Task Type</option>

                                        {categories.map((cat)=>(
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
                                        borderRadius:"50px",
                                        width:"100px"
                                        
                                    }}
                                    
                                   >
                                Edit
                            </Button>
                            <Button onClick={handleClose} variant='dark' className='mx-3' style={{borderRadius:"50px",width:"100px"}}>Cancel</Button>
                         
                        </div>
      
                           
                 </Form>

            </Modal.Body>

        </Modal>

    );
}

export default EditTaskModal;