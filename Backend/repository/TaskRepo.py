from Backend.models.Task import Task, TaskCreate, TaskUpdate
from Backend.utils.DBconnect import DBconnect


class TaskRepo:
    def __init__(self):
        self.__db = DBconnect()

    def get_all_tasks(self):
        sql = """
              select *
              from task
              """
        return self.__db.execute_return_query(sql, ())

    def get_task_by_id(self, task_id):
        sql = """
              select *
              from task
              where id = %s;
              """

        return self.__db.execute_return_query(sql, (task_id,))

    def create_task(self, task: TaskCreate):
        sql = """
              insert into task (description, is_done, is_deleted)
              values (%s, false, false)
              """

        return self.__db.execute_void_query(sql,
                                            (task.description,))

    def update_task(self, task: TaskUpdate):
        sql = """
              update task
              set description = %s,
                  is_done     = %s
              where id = %s;
              """

        return self.__db.execute_void_query(sql,
                                            (task.description,
                                             task.is_done,
                                             task.id))


    def delete_task_by_id(self, id: int):
        sql = """
        update task 
        set is_deleted = true
        where id = %s;
        """

        return self.__db.execute_void_query(sql, (id,))


    def search_task_by_description(self, description: str):
        sql = """
            select *
            from task
            where description like %s;
        """

        return self.__db.execute_return_query(sql, (f"%{description}%",))


    def get_tasks_pagination(self, limit: int, offset: int):
        sql = """
        select *
        from task
        where is_deleted = false
        limit %s 
        offset %s;
        """

        return self.__db.execute_return_query(sql, (limit, offset))


    def get_total_available_tasks(self):
        sql = """
        select count(*) as total
        from task
        where is_deleted = false;
        """

        return self.__db.execute_return_query(sql, ())