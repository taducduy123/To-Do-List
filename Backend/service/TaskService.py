from Backend.models.Task import Task
from Backend.repository.TaskRepo import TaskRepo


class TaskService:
    def __init__(self):
        self.__taskRepo = TaskRepo()


    def get_all_task(self):
        return self.__taskRepo.get_all_tasks()


    def create_task(self, task: Task):
        self.__taskRepo.create_task(task)
        return {"id" : f"{task.id}"}


