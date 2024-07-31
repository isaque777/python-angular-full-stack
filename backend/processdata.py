import concurrent.futures
import time
from db import create_courses_and_categories
from db import print_courses
from db import get_courses
from filereader import data_factory


def check_data_base(thread_id):
    """Thread Check Data Base if data expired."""
    print(f"Thread-{thread_id} started.")

    expired = True

    # Query the collection
    courses = get_courses().find()

    # Get the size of the cursor
    courses_list = list(courses)  # Convert cursor to list
    size = len(courses_list)  # Get the length of the list

    print(f"Size of courses: {size}")

    if size > 1:
        expired = False
        print("Data found in MongoDB. No need to process the CSV file.")

    if expired:
        initial_data()

    print(f"Thread-{thread_id} finished.")


def start_infinite_threads():
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
            time.sleep(610)


def initial_data():

    # Data has expired or is not present; start from step one
    print("No data found in MongoDB. Processing the CSV file and inserting data...")

    # Extract data from CSV
    df = data_factory()

    # Insert documents
    create_courses_and_categories(df)

    # Query and print all documents
    print("Initial documents:")
    print_courses()

    # Wait for TTL expiration (e.g., 11 minutes to be sure)
    print("Waiting for TTL expiration...")


def start_process():
    initial_data()
    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
    executor.submit(start_infinite_threads)
    return executor
