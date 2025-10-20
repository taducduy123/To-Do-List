from typing import Dict, Any

from fastapi import APIRouter
from Backend.models.Task import Task, TaskCreate
from Backend.service.TaskService import TaskService


# Services
taskService = TaskService()

router = APIRouter()


count = 0

@router.post("/api/task")
def create_task(task: TaskCreate):
    return taskService.create_task(task)


@router.get("/api/task")
def retrieve_tasks():
    global count
    count = count + 1
    print(count)
    return taskService.get_all_task()


@router.put("/api/task")
def update_task(task: Task):
    return taskService.update_task(task)


@router.delete("/api/task")
def delete_task(id: int):
    return taskService.delete_task_by_id(id)


@router.get("/api/task-search")
def search_task_by_description(keyword: str):
    return taskService.search_task_by_description(keyword)

