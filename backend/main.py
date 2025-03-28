import json
import math
from datetime import datetime
from typing import Dict, Optional

import mongomock
import uvicorn
from bson import ObjectId, json_util
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pymongo import ASCENDING, MongoClient


from db import (
    create_course,
    create_in_memory_mongodb,
    delete_course,
    get_categories_aggr,
    get_course,
    get_courses_paginated,
    update_course,
)
from filereader import data_factory
from processdata import start_process


def startup_event():
    """Function to run on application startup."""
    print("Application startup")

    expire_after_seconds = 600
    # Create in-memory MongoDB
    create_in_memory_mongodb(expire_after_seconds)

    # Start process
    start_process()

    # Main thread can continue executing other tasks
    print("Main thread continues execution...")
    # Add your other code here


def shutdown_event():
    """Function to run on application shutdown."""
    print("Application shutdown")


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the startup and shutdown events
app.add_event_handler("startup", startup_event)
app.add_event_handler("shutdown", shutdown_event)


class CourseData(BaseModel):
    University: str
    City: str
    Country: str
    CourseName: str
    CourseDescription: str
    Currency: str
    StartDate: str
    EndDate: str
    Price: float


@app.get("/courses/autocomplete")
async def autocomplete(
    q: Optional[str] = Query("", alias="q", description="Name to filter categories"),
    type: Optional[str] = Query(
        "", alias="type", description="Type of categories to filter"
    ),
):
    """Get category mappings for specified columns."""
    categories = get_categories_aggr(q, type)
    categories_list = list(categories)
    categories_json = json.loads(json_util.dumps(categories_list))
    return JSONResponse(content=categories_json, status_code=200)


@app.post("/courses")
async def create(course_data: CourseData):
    """Insert new course into the collection."""
    inserted_id = create_course(course_data.dict())
    return JSONResponse(content={"inserted_id": str(inserted_id)}, status_code=201)


@app.get("/courses")
async def find(
    page: int = Query(1, alias="page"),
    page_size: int = Query(10, alias="page_size"),
    q: Optional[str] = Query(
        "", alias="q", description="University name to filter categories"
    ),
):
    """Get courses with pagination."""
    courses_cursor = get_courses_paginated(page, page_size, q)
    # courses_list = list(courses_cursor)
    courses_json = json.loads(json_util.dumps(courses_cursor))
    return JSONResponse(content=courses_json, status_code=200)


@app.put("/courses/{course_id}")
async def update(course_id: str, update: Dict):
    """Update a course."""
    update_course(course_id, update)
    return JSONResponse(content={"modified_count": course_id}, status_code=200)


@app.delete("/courses/{course_id}")
async def delete(course_id: str):
    """Delete a course."""
    deleted_count = delete_course(course_id)
    return JSONResponse(content={"deleted_count": deleted_count}, status_code=200)


@app.get("/courses/{course_id}")
async def get(course_id: str):
    """API endpoint to get a course by its ID."""
    try:
        course = get_course(course_id)
        courses_json = json.loads(json_util.dumps(course))
        return JSONResponse(content=courses_json, status_code=200)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException as e:
        raise e


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
