from fastapi import FastAPI
from Backend.models.Task import Task
from Backend.service.TaskService import TaskService


# Services
taskService = TaskService()


app = FastAPI()

@app.get("/api/tasks")
def retrieve_tasks():
    return taskService.get_all_task()

@app.post("/api/tasks")
def create_task(task: Task):
    return taskService.create_task(task)



