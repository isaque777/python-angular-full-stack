import json
import re
import math
from datetime import datetime

from fastapi import HTTPException, status
import mongomock
import pandas as pd
from bson import ObjectId, json_util
from pymongo import ASCENDING, MongoClient

client = mongomock.MongoClient()
db = client["test_db"]
collection = db["course"]
categories_data = {}


def create_in_memory_mongodb(expire_after_seconds):
    """Create an in-memory MongoDB instance and return the client, database, and collection."""
    # Add TTL index to the 'createdAt' field
    # collection.create_index(
    #     [("createdAt", ASCENDING)], expireAfterSeconds=expire_after_seconds
    # )

    return client, db, collection


def create_courses_and_categories(df):
    """Convert DataFrame to dictionary and insert into MongoDB collection."""
    df_dict = df.to_dict(orient="records")

    # Add 'createdAt' field with current date and time
    current_time = datetime.utcnow()
    for record in df_dict:
        record["createdAt"] = current_time

    collection.insert_many(df_dict)

    print("Data inserted successfully")


def create_course(course_data):
    """Insert a new course into the collection."""
    if not isinstance(course_data, dict):
        raise TypeError("course_data must be an instance of dict")
    result = collection.insert_one(course_data)
    return result.inserted_id


def print_courses():
    """Query and print all courses in the collection."""
    for document in collection.find():
        print(document)


def get_courses():
    """Get all courses in the collection."""
    return collection


def get_categories_aggr(q, type):
    """Get all categories in the collection."""

    # Aggregation pipeline
    pipeline = [
        {"$match": {type: {"$regex": q, "$options": "i"}}},  # Case-insensitive match
        {"$group": {"_id": "$" + type}},
        {"$sort": {type: -1}},  # Sort by total number of courses, descending
    ]

    return collection.aggregate(pipeline)


def get_courses_paginated(page, page_size, q):
    """Query and print courses in the collection with pagination, including total items and total pages."""

    # Count total items in the collection
    total_items = collection.count_documents({})

    # Calculate the number of documents to skip
    skip = (page - 1) * page_size

    payload = {}

    if q:
        # Create a regex pattern for case-insensitive search
        regex_pattern = re.compile(q, re.IGNORECASE)

        # Construct the payload for MongoDB query
        payload = {
            "$or": [
                {"University": {"$regex": regex_pattern}},
                {"City": {"$regex": regex_pattern}},
                {"Country": {"$regex": regex_pattern}},
                {"CourseName": {"$regex": regex_pattern}},
                {"CourseDescription": {"$regex": regex_pattern}},
            ]
        }

    # Fetch the paginated results
    courses = collection.find(payload).skip(skip).limit(page_size)

    # Calculate total pages
    total_pages = math.ceil(total_items / page_size)

    # Convert courses to a list (if needed) and return along with pagination info
    courses_list = list(courses)
    return {
        "total_items": total_items,
        "total_pages": total_pages,
        "page": page,
        "page_size": page_size,
        "courses": courses_list,
    }


def update_course(id, update):
    """
    Update an item in the collection using a JSON object.

    :param json_data: JSON string containing the update data
    :return: The updated document
    """

    # Update the document
    update_result = collection.update_one({"_id": ObjectId(id)}, {"$set": update})

    if update_result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course with ID {id} not found",
        )

    print("Data updated successfully")
    print("updated_document")
    print(update_result)


def delete_course(id):
    """Delete a document from the collection."""
    collection.delete_one({"_id": ObjectId(id)})


def get_course(course_id):
    """Get a course by its ID."""
    if not ObjectId.is_valid(course_id):
        raise ValueError("Invalid ObjectId format")
    course = collection.find_one({"_id": ObjectId(course_id)})
    return course
