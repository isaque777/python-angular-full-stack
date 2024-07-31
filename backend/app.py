import json

from flask import Flask, request, jsonify
from flask_cors import CORS
from bson import json_util
from pydantic import BaseModel

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

app = Flask(__name__)
CORS(app)


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


def startup_event():
    """Function to run on application startup."""
    print("Application startup")

    expire_after_seconds = 100
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


# @app.before_first_request
# def before_first_request():
#     startup_event()


# @app.teardown_appcontext
# def teardown_appcontext(exception):
#     shutdown_event()


@app.route("/courses/autocomplete", methods=["GET"])
def autocomplete():
    q = request.args.get("q", "")
    type = request.args.get("type", "")
    categories = get_categories_aggr(q, type)
    categories_list = list(categories)
    categories_json = json.loads(json_util.dumps(categories_list))
    return jsonify(categories_json), 200


@app.route("/courses", methods=["POST"])
def create():
    course_data = request.json
    course_data_obj = CourseData(**course_data)
    inserted_id = create_course(course_data_obj.dict())
    return jsonify({"inserted_id": str(inserted_id)}), 201


@app.route("/courses", methods=["GET"])
def find():
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 10))
    q = request.args.get("q", "")
    courses_cursor = get_courses_paginated(page, page_size, q)
    courses_json = json.loads(json_util.dumps(courses_cursor))
    return jsonify(courses_json), 200


@app.route("/courses/<course_id>", methods=["PUT"])
def update(course_id):
    update = request.json
    update_course(course_id, update)
    return jsonify({"modified_count": course_id}), 200


@app.route("/courses/<course_id>", methods=["DELETE"])
def delete(course_id):
    deleted_count = delete_course(course_id)
    return jsonify({"deleted_count": deleted_count}), 200


@app.route("/courses/<course_id>", methods=["GET"])
def get(course_id):
    try:
        course = get_course(course_id)
        courses_json = json.loads(json_util.dumps(course))
        return jsonify(courses_json), 200
    except ValueError as e:
        return jsonify({"detail": str(e)}), 400
    except Exception as e:
        return jsonify({"detail": str(e)}), 500


if __name__ == "__main__":
    startup_event()
    shutdown_event()
    app.run(host="0.0.0.0", port=8000)
