1. Overview
   - At this point, i'm focusing on Backend with implemtation of RESTful API
2. Features (until this time):
   - Writing API for creating a task in to-do list
   - Writing API for viewing all tasks in to-do list
   - Writing API for editing a task in to-do list
   - Writing API for deleting a task in to-do list
   - Writing API for searching tasks by their description (name) in to-do list
3. Tech Stack:
   - Backend: fastAPI
   - Fronend: Reactjs
   - Database: MySQL
   - Tools: Pycharm, Postman
4. System Architechture Diagram
5. Project Structure
6. Setup & Installation (How to run my code):
   - First, please install fastAPI (pip install fastapi) and uvicorn (pip install uvicorn) beforehand
   - Second, you must set up your database (MySQL) beforehand. To do that:
     1. Go Backend/utils/DBconnect.py -> look for line 8-10 -> then enter your username and password (MySQL) here
     2. Go folder Database -> run DDL.sql and DML.sql to create the database
   - At last, to run code, type the following command in your terminal: uvicorn main:app --reload
7. API Endpoints
| Method | Path            | Description      |
|-------|-----------------|------------------|
| POST    | 127.0.0.1:8000/api/task    | Create a new task   | 
| GET   | 127.0.0.1:8000/api/task    | Retrieve all tasks         | 
| PUT    | 127.0.0.1:8000/api/task  | Update a task    | 
| DELETE    | 127.0.0.1:8000/api/task?id=...  | Delete a task    | 
| GET    | 127.0.0.1:8000/api/task-search?keyword=...  | Search a task by name    |
|-------|-----------------|------------------|
9. Screenshots / Demo
10. Acceptance Criteria

