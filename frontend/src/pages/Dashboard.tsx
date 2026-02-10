
import HomeNavbar from "../components/Navbar";
import SidePanel from "../components/SidePanel";
import { Container,Row,Col } from "react-bootstrap";

export default function DashboardPage(){


    return  (
        <>
        <div style={{ flexShrink: 0 }}>
             <HomeNavbar/>
        </div>
       
        <Container fluid className="vh-100 d-flex p-0">
            <Row>
                <Col md={2} className="p-0">
                      <SidePanel/>
                </Col>
                <Col md={10} className="p-4">
                <h3>Welcome to Dashboard</h3>
                <p>This is your main board component</p>
                </Col>
            </Row>
           
        </Container>
           
            

       
  
         </>

       
   );
  
     
};