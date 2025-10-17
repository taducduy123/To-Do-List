1. Overview
   - At this point, i'm focusing on Backend with implemtation of RESTful API
2. Features (until this time):
   - Writing API for creating a task in to-do list
   - Writing API for viewing all tasks in to-do list
   - Writing API for editing a task in to-do list
   - Writing API for deleting a task in to-do list
   - Writing API for searching tasks by their description (name) in to-do list
3. How to run code:
   - First, please install fastAPI (pip install fastapi) and uvicorn (pip install uvicorn) beforehand
   - Second, you must set up your database (MySQL) beforehand. To do that:
     1. Go Backend/utils/DBconnect.py -> look for line 8-10 -> then enter your username and password (MySQL) here
     2. Go folder Database -> run DDL.sql and DML.sql to create the database
   - At last, to run code, type the following command in your terminal: uvicorn main:app --reload
