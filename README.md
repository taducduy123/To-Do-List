# Overview
   - At this point, i'm focusing on Backend with implemtation of RESTful API
# Features (until this time):
   - Writing API for creating a task in to-do list
   - Writing API for viewing all tasks in to-do list
   - Writing API for editing a task in to-do list
   - Writing API for deleting a task in to-do list
   - Writing API for searching tasks by their description (name) in to-do list
# Tech Stack:
   - Backend: fastAPI
   - Fronend: Reactjs
   - Database: MySQL
   - Tools: Pycharm, Postman
# System Architechture Diagram
# Project Structure
├── Backend
│   ├── APIs
│   │   └── TaskAPI.py
│   ├── models
│   │   └── Task.py
│   ├── repository
│   │   └── TaskRepo.py
│   ├── service
│   │   └── TaskService.py
│   └── utils
│       └── DBconnect.py
├── Database
│   ├── DDL.sql
│   └── DML.sql
├── Dockerfile
├── main.py
├── README.md
├── requirements.txt
# Setup & Installation (How to run my code):
   - First, please install fastAPI (pip install fastapi), uvicorn (pip install uvicorn), and MySQL beforehand
   - Second, you must set up your database (MySQL) beforehand. To do that:
     1. Go Backend/utils/DBconnect.py -> look for line 8-10 -> then enter your username and password (MySQL)
     2. Go folder Database -> run DDL.sql and DML.sql to create the database
   - Finally, to run code, type the following command in your terminal: uvicorn main:app --reload
# API Endpoints
   <table>
  <thead>
    <tr>
      <th style="text-align:right">Method</th>
      <th>Path</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="text-align:right">POST</td><td><code>http://127.0.0.1:8000/api/task</code></td><td>Create a new task</td></tr>
    <tr><td style="text-align:right">GET</td><td><code>http://127.0.0.1:8000/api/task</code></td><td>Retrieve all tasks</td></tr>
     <tr><td style="text-align:right">PUT</td><td><code>http://127.0.0.1:8000/api/task</code></td><td>Update a task</td></tr>
     <tr><td style="text-align:right">DELETE</td><td><code>http://127.0.0.1:8000/api/task?id=</code></td><td>Delete a task by id</td></tr>
     <tr><td style="text-align:right">GET</td><td><code>http://127.0.0.1:8000/api/task-search?keyword=</code></td><td>Search tasks by name</td></tr>
  </tbody>
</table>

# Screenshots/Demo
# Acceptance Criteria
