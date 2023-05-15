from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from uvicorn import run
from pymongo import MongoClient
from dotenv import dotenv_values
from routers.itemsRoutes import router as itemsRouter

import os


# get environment variables
config = dotenv_values(".env")

# create a fastAPI instance
app = FastAPI()

# include the routers
app.include_router(itemsRouter)

# define the root path
@app.get("/")
async def root():
    return {"message": "Hello World"}

# add CORS to allow cross origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db_client():
    app.client = MongoClient(config["MONGO_URL"])
    app.database = app.client[config["DB_NAME"]]

@app.on_event("shutdown")
def shutdown_db_client():
    app.client.close()
    
app.mount("/static", StaticFiles(directory="../web"), name="static")

if __name__ == "__main__":
    run("main:app", host="0.0.0.0", port=8080, log_level="info")