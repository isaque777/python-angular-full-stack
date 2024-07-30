import mongomock
from pymongo import MongoClient
from pymongo import ASCENDING
from datetime import datetime

client = mongomock.MongoClient()
db = client["test_db"]
collection = db["course"]


def create_in_memory_mongodb(expire_after_seconds):
    """Create an in-memory MongoDB instance and return the client, database, and collection."""
    # Add TTL index to the 'createdAt' field
    collection.create_index(
        [("createdAt", ASCENDING)], expireAfterSeconds=expire_after_seconds
    )

    return client, db, collection


def create_courses(df):
    """Convert DataFrame to dictionary and insert into MongoDB collection."""
    df_dict = df.to_dict(orient="records")

    # Add 'createdAt' field with current date and time
    current_time = datetime.utcnow()
    for record in df_dict:
        record["createdAt"] = current_time

    collection.insert_many(df_dict)


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


def get_courses(page, page_size):

    # Example usage
    # page = 1  # Page number (starting from 1)
    # page_size = 10  # Number of documents per page

    # get_courses(collection, page, page_size)

    """Query and print courses in the collection with pagination."""
    # Calculate the number of documents to skip
    skip = (page - 1) * page_size

    # Fetch the paginated results
    courses = collection.find().skip(skip).limit(page_size)

    return courses


def update_course(filter, update):
    """Update a document in the collection."""
    collection.update_one(filter, update)


def delete_course(filter):
    """Delete a document from the collection."""
    collection.delete_one(filter)
