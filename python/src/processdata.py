import concurrent.futures
import time
from db import create_courses
from db import print_courses
from db import get_courses
from filereader import data_factory


def check_data_base(thread_id):
    """Thread Check Data Base if data expired."""
    print(f"Thread-{thread_id} started.")

    expired = True

    if get_courses().find().size() == 0:
        expired = False
        print("Data found in MongoDB. No need to process the CSV file.")

        # # Update a document
        # update_document(collection, {"University": ""}})

        # Query and print all documents after update
        # print("\nDocuments after update:")
        # query_collection(collection)

        # Delete a document
        # delete_document(collection, {"University": ""})

        # Query and print all documents after deletion
        # print("\nDocuments after deletion:")
        # query_collection(collection)

        # Wait for TTL expiration (e.g., 11 minutes to be sure)

    if expired:
        initial_data()

    print(f"Thread-{thread_id} finished.")


def start_infinite_threads(expire_after_seconds):
    """Start an effectively infinite number of threads with a ThreadPoolExecutor."""
    # Create a ThreadPoolExecutor to manage threads
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        thread_id = 0
        while True:
            # Submit a new task to the executor
            executor.submit(check_data_base, thread_id)
            thread_id += 1
            # Optional: sleep to simulate some delay
            print("Waiting for TTL expiration...")
            time.sleep(1)


def initial_data():

    # Data has expired or is not present; start from step one
    print("No data found in MongoDB. Processing the CSV file and inserting data...")

    # Extract data from CSV
    df = data_factory()

    # Insert documents
    create_courses(df)

    # Query and print all documents
    print("Initial documents:")
    print_courses()

    # Wait for TTL expiration (e.g., 11 minutes to be sure)
    print("Waiting for TTL expiration...")


def start_process(expire_after_seconds):
    initial_data()
    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
    executor.submit(start_infinite_threads, expire_after_seconds)
    return executor
