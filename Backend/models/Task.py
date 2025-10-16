from pydantic import BaseModel

class Task(BaseModel):
    id: int
    description: str
    is_done: bool
    is_deleted: bool

    # def get_id(self):
    #     return self.__id
    #
    # def get_description(self):
    #     return self.__description
    #
    # def get_is_done(self):
    #     return self.__is_done
    #
    # def get_is_delete(self):
    #     return self.__is_delete
    #
    # def set_is_done(self, is_done):
    #     self.__is_done = is_done
    #
    # def set_is_delete(self, is_delete):
    #     self.__is_delete = is_delete
    #
    # def set_description(self, description):
    #     self.__description = description
    #
    # def set_id(self, id):
    #     self.__id = id


