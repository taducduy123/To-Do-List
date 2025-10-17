from fastapi import APIRouter
from Backend.models.Task import Task
from Backend.service.TaskService import TaskService


# Services
taskService = TaskService()

router = APIRouter()


@router.post("/api/tasks")
def create_task(task: Task):
    return taskService.create_task(task)


@router.get("/api/tasks")
def retrieve_tasks():
    return taskService.get_all_task()


@router.put("/api/tasks/{task_id}")
def edit_task():
    print("put is running")



