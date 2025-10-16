import json

from fastapi import FastAPI
from Backend.service.TaskService import TaskService

taskService = TaskService()

app = FastAPI()

@app.get("/task")
def view_all_tasks():
    return taskService.get_all_task()

