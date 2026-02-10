
import { Form ,Modal,Button} from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";


interface  AddCategoryModalProps{
    show:boolean;
    handleClose:()=> void;
}

function  AddCategoryModal({show,handleClose}:  AddCategoryModalProps) {

    const [category,setCategory] =useState("");

    const addCategory =async (e:any)=>{
        e.preventDefault();

        if(!category.trim()){
            toast.error("Please enter category name");
            return;
        }

        try{
            const token = localStorage.getItem("token");
            if(!token){
               toast.error("User not logged in");
               return;
            }



            const res= await axios.post("http://localhost:5011/api/tasks/add-category",
                {categoryName:category},
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                });

            if(res.status === 201){
                toast.success("Category Added Succssfully");
                handleClose();
                setCategory("");
                 
            }
           

        }catch(err){
            console.error(err);
            toast.error("Failed to add category");

        
        }
    };



  
    return (
        <Modal show={show} onHide={handleClose} size="sm" >
            <Modal.Header  style={{ backgroundColor: 'lightpink', borderColor: 'lightpink', color: 'black' }} closeButton>
            <Modal.Title className='w-100 text-center'>Create New Category</Modal.Title>
            </Modal.Header>

            <Modal.Body >
                 <Form onSubmit={addCategory}>
                    <Form.Group className="mb-3 w-100" >
                        <Form.Label>Category </Form.Label>
                        <Form.Control type="text"
                                      placeholder="Enter New Category"
                                      name="category" 
                                      onChange={(e)=>setCategory(e.target.value)}
                                      />
                    </Form.Group>
                    

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

export default AddCategoryModal;