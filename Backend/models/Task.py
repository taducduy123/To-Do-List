from pydantic import BaseModel

class Task(BaseModel):
    id: int
    description: str
    is_done: bool
    is_deleted: bool


class TaskCreate(BaseModel):
    description: str


class TaskUpdate(BaseModel):
    id: int
    description: str
    is_done: bool


