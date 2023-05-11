from fastapi import FastAPI 
from routers.itemsRoutes import router as itemsRouter
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import dotenv_values
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