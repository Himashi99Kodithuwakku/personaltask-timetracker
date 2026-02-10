import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const SidePanel = ()=> {
    return(
        <div style={{
            width: "220px",
            height: "100vh",
            backgroundColor :"black",
            padding: "15px",
            position: "fixed",
            left:0,
            top:0,
            


        }}>
           <h3 style={{color:"lightpink",
                     fontWeight: "bold"
           }} >Dashboard</h3>

           <Nav className="flex-column mt-3">
                <Nav.Link as ={Link} to="/user-task-manager" style={{color:"white"}}>My Tasks</Nav.Link>
           </Nav>

            <Nav className="flex-column mt-3">
                <Nav.Link as ={Link} to="/user-edit-task-manager" style={{color:"white"}}>Edit My tasks </Nav.Link>
           </Nav>


        </div>


    )
};

export default SidePanel;