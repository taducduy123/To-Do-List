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

