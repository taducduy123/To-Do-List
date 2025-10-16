class Task:
    def __init__(self, id, description):
        self.__id = id
        self.__description = description
        self.__is_done = False
        self.__is_delete = False
