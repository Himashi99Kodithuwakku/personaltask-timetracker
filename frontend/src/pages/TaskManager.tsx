
import HomeNavbar from "../components/Navbar";
import SidePanel from "../components/SidePanel";
import { Container,Row,Col, Button,Table,Pagination,Form} from "react-bootstrap";
import { useState } from "react";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import AddCategoryModal from "../components/modals/AddCategory";
import { useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay,faStop } from '@fortawesome/free-solid-svg-icons';



export default function TaskManagementPage(){

    const [showCreateModal,setShowCreateModal]=useState(false);
    const [showCategoryModal,setShowCategoryModal]=useState(false);
    const [tasks, setTasks] = useState<any[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    const [timers, setTimers] = useState<{[key:string]: number}>({});
    const [runningTask, setRunningTask] = useState<string | null>(null);
    const [totalTimes, setTotalTimes] = useState<{ [key: string]: number }>({});
    const [sortBy, setSortBy ] = useState ("");
    // const currentTasks = sortedTasks.slice(indexOfFirstRow, indexOfLastRow);




    const OpenCreateModal =()=>{
        setShowCreateModal(true);
    }

    const CloseCreateModal =()=>{
        setShowCreateModal(false);
    }

    const OpenCategoryModal =()=>{
        setShowCategoryModal(true);
    }

    const CloseCategoryModal =()=>{
        setShowCategoryModal(false);
    }

    
    const loadTasks = async()=>{
        try{
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5011/api/tasks/all-tasks",
            { 
                headers:{
                    Authorization:`Bearer ${token}`,
                },

            });
            console.log("Tasks loaded:", res.data); 
            setTasks(res.data);
            loadTotalTime(res.data);
        }catch(err){
                console.error("Failed to load categories",err);
        }
    };

    useEffect(()=>{
        loadTasks();
    },[ ]);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    // const currentTasks = tasks.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.max(1, Math.ceil(tasks.length / rowsPerPage));

    const handlePageChange = (pageNumber: number) => 
        setCurrentPage(pageNumber);

    const taskStatus = async (taskId: string,status:boolean) => {

        try {
            const token = localStorage.getItem("token");

            await axios.put(
            `http://localhost:5011/api/tasks/task-status/${taskId}`,
            {is_completed:status},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    },
            }
            );

            loadTasks();
        } catch (err) {
            console.error("Failed to update status", err);
            
        }
        };

    const startTimer = async(taskId:string)=>{
        const token = localStorage.getItem("token");

        await axios.post("http://localhost:5011/api/timer/start-timer",{taskId},{
             
                headers: {
                        Authorization: `Bearer ${token}`
                    },
        }
        );
   // time keep going 
        localStorage.setItem("runningTask", taskId);
        localStorage.setItem("runningTaskStart", Date.now().toString());
        setRunningTask(taskId);
        setTimers(prev=>({
            ...prev,
            [taskId]:0
        }));
    };

    const stopTimer = async(taskId:string)=>{
        const token = localStorage.getItem("token");

        await axios.post("http://localhost:5011/api/timer/stop-timer",{taskId},{
             
                headers: {
                        Authorization: `Bearer ${token}`
                    },
        }
        );

        localStorage.removeItem("runningTask");
        localStorage.removeItem("runningTaskStart");

        setRunningTask(null);
        loadTasks();
    };

    useEffect(() => {
        const savedTask = localStorage.getItem("runningTask");
        const savedStart = localStorage.getItem("runningTaskStart");

        if(savedTask && savedStart){
            setRunningTask(savedTask);

            // Calculate elapsed time since timer started
            const elapsed = Math.floor((Date.now() - parseInt(savedStart)) / 1000);
            setTimers(prev => ({
                ...prev,
                [savedTask]: elapsed
            }));
        }
    }, []);

    useEffect(() => {
        let interval: any;

        if (runningTask) {
            interval = setInterval(() => {
            setTimers(prev => ({
                ...prev,
                [runningTask]: (prev[runningTask] || 0) + 1
            }));
            }, 1000);
        }

        return () => clearInterval(interval);
        }, [runningTask]);

       const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        return `${h.toString().padStart(2, "0")}h : ${m.toString().padStart(2, "0")}m : ${s.toString().padStart(2, "0")}s`;
    };

    const loadTotalTime = async (taskList:any[]) => {
        const token = localStorage.getItem("token");
        const newTotals:any = {};

        for(let task of taskList){
            try{
                const res = await axios.get(`http://localhost:5011/api/timer/total-time/${task.taskid}`,
                    {
                        headers: {
                             Authorization: `Bearer ${token}`
                    },
                    }
                );
                newTotals[task.taskid] = Number(res.data.total_seconds);
            }catch(err){
                console.error("Failed to load total time",task.taskid);
            }
        }
        setTotalTimes(newTotals);
        console.log("TotalTimes:", totalTimes);
    };

    const sortedTasks = [...tasks].sort((a,b)=>{
        switch(sortBy){
            case "Date" :
                const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
                const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
                return dateA-dateB;
            case "Status" :
                return(a.is_completed === b.is_completed) ? 0 : a.is_completed ? 1 : -1;
            
            case "Time"  :
                return(totalTimes[a.taskid] || 0 ) - (totalTimes[b.taskid] || 0);

            case "Category" :
                return(a.categoryname.localeCompare(b.categoryname));
            default:
                return 0;



        }
    });

    const currentTasks = sortedTasks.slice(indexOfFirstRow, indexOfLastRow);

    return  (
        <>
        <HomeNavbar/>
        
        <Container fluid className="vh-100 p-0" style={{backgroundColor:"#f7e8ea", marginTop:"50px"}}>
            <Row className="flex-grow-1 w-100 m-0">
                <Col md={2} className="p-0 bg-light">
                      <SidePanel/>
                </Col>
                <Col md={10} className="p-4" style={{ marginLeft: "220px", height: "calc(100vh - 70px)", overflowY: "auto" }}>
                <div style={{ flexShrink: 0 }}>
                    <h3 className="text-center mb-2" style={{fontWeight:"bolder"}} >MY TASKS</h3>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <Button variant="dark" onClick={OpenCreateModal} className="mx-4 px-3" style={{ borderRadius:"50px"}}>Create New Task</Button>
                            <Button onClick={OpenCategoryModal} className="mx-1 px-3" style={{backgroundColor:"lightpink" , border:"lightpink", color:"black", borderRadius:"50px" }}>Add New Category</Button>

                        </div>
                   

                    <Form.Group className="mb-3" >
                        <Form.Label>Sort by</Form.Label><br></br>
                            <Form.Select 

                                name="filter"
                                value={sortBy}
                                onChange={(e)=>setSortBy(e.target.value)}
                                style={{width:"200px"}}>

                                    <option value=""> Sort Tasks</option>
                                    <option value="Date"> Date</option>
                                    <option value="Time"> Time</option>
                                    <option value="Category"> Category</option>
                                    <option value="Status"> Status</option>

                            </Form.Select>
                    </Form.Group>

                    
                    
                    </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", marginTop: "15px" }} >
                    <Table striped bordered hover responsive className="mt-4">
                        <thead className="text-center">
                            <tr>
                            <th>Task Id</th>
                            <th>Task</th>
                            <th>Category</th>
                            <th>Due Date</th>
                            <th>Time Spent</th>
                            <th colSpan={2} >Track Time</th>
                            <th>Status</th>
                            
                        </tr>

                        </thead>
                        <tbody className="text-center">
                        {currentTasks.map((task:any)=>(
                            <tr key={task.taskid}>
                                <td>{task.taskid}</td>
                                <td>{task.task_text}</td>
                                <td>{task.categoryname}</td>
                                <td>{task.due_date ? task.due_date.split("T")[0] : "No Due Date"}</td>
                                <td>{formatTime(totalTimes[task.taskid] || 0)}</td>
                                <td>{formatTime(timers[task.taskid] || 0)}</td>
                                <td>
                                    {runningTask === task.taskid ? (
                                        <Button variant="danger" onClick={() => stopTimer(task.taskid)} style={{width:"50px", borderRadius:"50px" }}> <FontAwesomeIcon icon={faStop}/></Button>
                                    ) : (
                                        <Button variant="dark" onClick={() => startTimer(task.taskid)} style={{width:"50px", borderRadius:"50px" }}> <FontAwesomeIcon icon={faPlay}/></Button>
                                    )}
                                </td>
                                <td>
                                    <select
                                        className="form-select form-select-sm text-center"
                                        value={task.is_completed ? "completed" : "pending"}
                                        onChange={(e) => taskStatus(task.taskid, e.target.value === "completed")}
                                        style={{backgroundColor:task.is_completed ? "green" : "orange", color:"white" ,width:"150px", borderRadius:"50px"}}
                                    >
                                
                                    <option value="pending" >Pending</option>
                                    <option value="completed">Completed</option>
                                </select>
                                    
                                </td>
                                
                                    
                            </tr>

                        ))}                                     
                        </tbody>
                    </Table>

                      <Pagination className="justify-content-center">
                        {Array.from({ length: totalPages }, (_, idx) => (
                            <Pagination.Item
                            key={idx + 1}
                            active={currentPage === idx + 1}
                            onClick={() => handlePageChange(idx + 1)}
                            >
                            {idx + 1}
                            </Pagination.Item>
                        ))}
                        </Pagination>
                </div>    
                </Col>
            </Row> 
        </Container>

        <CreateTaskModal show={showCreateModal} handleClose={CloseCreateModal} onTaskAdded={loadTasks} />
        <AddCategoryModal show={showCategoryModal} handleClose={CloseCategoryModal}/>
        
           
            

       
  
         </>

       
   );
  
     
};