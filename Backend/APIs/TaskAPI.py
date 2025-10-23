from typing import Dict, Any

from fastapi import APIRouter
from Backend.models.Task import Task, TaskCreate, TaskUpdate
from Backend.service.TaskService import TaskService

# Global variables
count_number_call_create_task_api = 0
count_number_call_retrieve_tasks_api = 0
count_number_call_update_task_api = 0
count_number_call_delete_task_api = 0
count_number_call_search_task_by_description_api = 0


# Services
taskService = TaskService()

router = APIRouter()


@router.post("/api/task")
def create_task(task: TaskCreate):
    global count_number_call_create_task_api
    count_number_call_create_task_api += 1
    print(f"(POST) /api/task: {count_number_call_create_task_api} times")
    return taskService.create_task(task)


@router.get("/api/task")
def retrieve_tasks():
    global count_number_call_retrieve_tasks_api
    count_number_call_retrieve_tasks_api += 1
    print(f"(GET) /api/task: {count_number_call_retrieve_tasks_api} times")
    return taskService.get_all_task()


@router.put("/api/task")
def update_task(task: TaskUpdate):
    global count_number_call_update_task_api
    count_number_call_update_task_api += 1
    print(f"(PUT) /api/task: {count_number_call_update_task_api} times")
    return taskService.update_task(task)


@router.delete("/api/task")
def delete_task(id: int):
    global count_number_call_delete_task_api
    count_number_call_delete_task_api += 1
    print(f"(DELETE) /api/task: {count_number_call_delete_task_api} times")
    return taskService.delete_task_by_id(id)


@router.get("/api/task-search")
def search_task_by_description(keyword: str):
    global count_number_call_search_task_by_description_api
    count_number_call_search_task_by_description_api += 1
    print(f"(GET) /api/task-search: {count_number_call_search_task_by_description_api} times")
    return taskService.search_task_by_description(keyword)


@router.get("/api/task-pagination")
def retrieve_task_per_page(page: int, size: int):
    return taskService.get_tasks_per_page(page, size)


@router.get("/api/task-count")
def count_total_available_tasks():
    return taskService.count_total_available_tasks()

