import mongomock
from bson import ObjectId
from pymongo import MongoClient
from pymongo import ASCENDING
from datetime import datetime
import pandas as pd
import math

client = mongomock.MongoClient()
db = client["test_db"]
collection = db["course"]
categories = db["categories"]
categories_data = {}


def create_in_memory_mongodb(expire_after_seconds):
    """Create an in-memory MongoDB instance and return the client, database, and collection."""
    # Add TTL index to the 'createdAt' field
    collection.create_index(
        [("createdAt", ASCENDING)], expireAfterSeconds=expire_after_seconds
    )

    return client, db, collection


def create_courses_and_categories(df):
    """Convert DataFrame to dictionary and insert into MongoDB collection."""
    df_dict = df.to_dict(orient="records")

    # Add 'createdAt' field with current date and time
    current_time = datetime.utcnow()
    for record in df_dict:
        record["createdAt"] = current_time

    collection.insert_many(df_dict)

    # Convert data to DataFrame
    # df = pd.DataFrame(cat_df)

    #  Join Country, City, and University into Location
    # df["Location"] = df[["Country", "City", "University"]].agg(", ".join, axis=1)

    # Convert DataFrame to a list of dictionaries
    # data_to_insert = df.to_dict(orient="records")

    # Insert data into MongoDB
    # categories.insert_many(data_to_insert)

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


def get_categories():
    """Get all categories in the collection."""
    return categories.find()


def get_categories_aggr(q, type):
    """Get all categories in the collection."""

    # Aggregation pipeline
    pipeline = [
        {"$match": {type: {"$regex": q, "$options": "i"}}},  # Case-insensitive match
        {"$group": {"_id": "$" + type}},
        {"$sort": {type: -1}},  # Sort by total number of courses, descending
    ]

    return collection.aggregate(pipeline)


def get_courses_paginated(page, page_size):
    """Query and print courses in the collection with pagination, including total items and total pages."""

    # Count total items in the collection
    total_items = collection.count_documents({})

    # Calculate the number of documents to skip
    skip = (page - 1) * page_size

    # Fetch the paginated results
    courses = collection.find().skip(skip).limit(page_size)

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


def update_course(filter, update):
    """Update a document in the collection."""
    collection.update_one(filter, update)


def delete_course(filter):
    """Delete a document from the collection."""
    collection.delete_one(filter)


def get_course(course_id):
    """Get a course by its ID."""
    if not ObjectId.is_valid(course_id):
        raise ValueError("Invalid ObjectId format")
    course = collection.find_one({"_id": ObjectId(course_id)})
    return course
