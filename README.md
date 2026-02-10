# Personaltask-timetracker
Full stack development assignment

# Project Decription 
 * Personal Task Timer Tracker is a web application that allows users to :-
   
         * User Authentication with Register, Login
         * Create, Edit, and delete tasks
         * Add new task categories 
         * Track time spent on tasks using a live timer
         * Timer continues runinnig even if the user navigates to other pages
         * Task sort by date, time, category and status
         * Responsive and user friendly UI built with React and Bootstrap
         
# Technology Stack
* Frontend * - React.js with TypeScript
  * React - 18.2.0  + TypeScript
  * React - Bootstrap
  * Axios
  * React-Router-Dom

* Backend * - Node.js 
  * Node.js - 18+
  * Express.js - 4.0.0
  * PostgreSQL
  * JWT for authentication
    
* Other Tools *
  * FontAwesome icons
  * React Toast notifications

# Setup Instructions :-

- clone the repository  ->  go to repository -> find HTTP tab copy link -> opeb folder locally -> type cmd in the path bar and press enter  then it will open the termial  
- In the terminal type git clone paste the copied url and enter  --->  "git clone  https://github.com/<your-username>/<repo-name>.git"
- Next type code . in the terminal press enter button it will open the vs cide 
- open the terminal in the vs code and go to correct path using terminal install dependencies

        cd backend -> npn install
        cd frontend -> npm install
        create .env file in backend folder include below variables
        
              PORT = <your_backend_port>
              JWT_SECRET_KEY = <your_secret_key> 
              DB_HOST=localhost
              DB_USER=postgres
              DB_PASSWORD=your <your_db_password>
              DB_NAME=personal_task_time_tracker  <--- your db name
              DB_PORT = <your db port>
      
* Running the app
    * cd backend -> npm run dev
    * cd frontend -> npm start

# API Endpoints Documentation
  * HOME
    * Homepage - /

  * AUTH 
    *  Register a new user :- POST /api/auth/user-register
    *  Login with email & password :- POST /api/auth/user-login

  * TASKS
    * Create a new task :- POST /api/tasks/add-task
    * Edit task details :- PUT /api/tasks/update-task/:taskId
    * Delete task :-  DELETE /api/tasks/delete-task/:taskId
    * Get all tasks :- GET /api/tasks/all-tasks
    * Add new task category :- POST /api/tasks/add-category
    * Load task categories :- GET /api/tasks/load-category
    * Update task status :- PUT /api/tasks/task-status/:taskId

  * TIMER
    * Start timer :- POST /api/timer/start-timer
    * Stop timer :- POST /api/timer/stop-timer
    * Get Total time :- POST /api/timer/total-time/:taskId
    
    
    
    
  
  
  
  
    
  
  
