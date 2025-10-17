from fastapi import FastAPI

from Backend.APIs.TaskAPI import router as router_tasks_api

app = FastAPI()
app.include_router(router_tasks_api)

