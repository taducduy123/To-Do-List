from Backend.models.Task import Task, TaskCreate, TaskUpdate
from Backend.repository.TaskRepo import TaskRepo


class TaskService:
    def __init__(self):
        self.__taskRepo = TaskRepo()


    def get_all_task(self):
        return self.__taskRepo.get_all_tasks()


    def create_task(self, task: TaskCreate):
        result =  self.__taskRepo.create_task(task)
        return {"id" : f"{result['last_row_id']}"}


    def update_task(self, task: TaskUpdate):
        self.__taskRepo.update_task(task)
        return {"id" : f"{task.id}"}


    def delete_task_by_id(self, id: int):
        self.__taskRepo.delete_task_by_id(id)
        return {"id" : f"{id}"}


    def search_task_by_description(self, description: str):
        return self.__taskRepo.search_task_by_description(description)