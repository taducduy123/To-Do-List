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
| Method | Path                | Description                  |
| -----: | ------------------- | ---------------------------- |
|    GET | `/api/tasks`        | Retrieve all tasks           |
|   POST | `/api/tasks`        | Create a new task            |
|    GET | `/api/tasks/{id}`   | Retrieve a task by ID        |
|  PATCH | `/api/tasks/{id}`   | Partially update a task      |
|    PUT | `/api/tasks/{id}`   | Replace a task (full update) |
| DELETE | `/api/tasks/{id}`   | Delete a task by ID          |
|    GET | `/api/tasks/search` | Search tasks by `keyword`    |

9. Screenshots / Demo
10. Acceptance Criteria

