# University Courses API

This project is a FastAPI-based RESTful API for managing university courses. The API supports creating, retrieving, updating, and deleting course data, with data stored in an in-memory MongoDB database (using `mongomock` for testing). The data expires after 10 minutes, and the system automatically reprocesses the CSV file and reinserts the data if no data is found in the database.

## Features

- **Create Course**: Add a new course to the database.
- **Retrieve Courses**: Retrieve a list of courses with pagination.
- **Update Course**: Update an existing course's details.
- **Delete Course**: Remove a course from the database.
- **Automatic Data Expiration**: Data in the database expires every 10 minutes, ensuring it is refreshed regularly.

## Technologies Used

- **Python**
- **FastAPI**
- **MongoDB** (In-memory using `mongomock` for testing)
- **Pandas** (for data processing)
- **scikit-learn** (for data normalization)
- **Pymongo** (for MongoDB interaction)

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/university-courses-api.git
    cd university-courses-api
    ```

2. **Create and activate a virtual environment**:
    ```bash
    python3 -m venv env
    source env/bin/activate  # On Windows: env\Scripts\activate
    ```

3. **Install the required packages**:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Application

1. **Start the FastAPI server**:
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```


## API Endpoints

### Create a Course

- **URL**: `/courses`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "University": "Example University",
        "City": "Example City",
        "Country": "Example Country",
        "CourseName": "Example Course",
        "CourseDescription": "Example Description",
        "Currency": "USD",
        "StartDate": "2023-09-01",
        "EndDate": "2023-12-01",
        "Price": 1000.0
    }
    ```
- **Response**:
    ```json
    {
        "inserted_id": "60b8d295fe2b4f9a3c5d9f84"
    }
    ```

### Retrieve Courses

- **URL**: `/courses`
- **Method**: `GET`
- **Query Parameters**:
    - `page`: The page number (default is 1)
    - `page_size`: The number of items per page (default is 10)
- **Response**:
    ```json
    [
        {
            "_id": "60b8d295fe2b4f9a3c5d9f84",
            "University": "Example University",
            "City": "Example City",
            "Country": "Example Country",
            "CourseName": "Example Course",
            "CourseDescription": "Example Description",
            "Currency": "USD",
            "StartDate": "2023-09-01T00:00:00Z",
            "EndDate": "2023-12-01T00:00:00Z",
            "Price": 1000.0,
            "createdAt": "2023-06-02T18:00:00Z"
        }
    ]
    ```

### Update a Course

- **URL**: `/courses/{course_id}`
- **Method**: `PUT`
- **Request Body**:
    ```json
    {
        "CourseDescription": "Updated Description",
        "Price": 1200.0
    }
    ```
- **Response**:
    ```json
    {
        "modified_count": 1
    }
    ```

### Delete a Course

- **URL**: `/courses/{course_id}`
- **Method**: `DELETE`
- **Response**:
    ```json
    {
        "deleted_count": 1
    }
    ```

## Directory Structure

```
university-courses-api/
│
├── static/
│   └── UniversitySchema.csv        # Sample CSV file with course data
│
├── src/
│   ├── app.py                      # Main App File 
│   ├── db.py                       # Database operations
│   ├── app.py                      # FastAPI endpoints
│   └── processdata.py              # Data processing and threading logic
│
├── requirements.txt                # Python package dependencies
├── README.md                       # Project documentation
└── main.py                         # Entry point to start the FastAPI server
```

## Contributing

1. **Fork the repository**.
2. **Create a new branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. **Commit your changes**:
    ```bash
    git commit -m 'Add some feature'
    ```
4. **Push to the branch**:
    ```bash
    git push origin feature/your-feature-name
    ```
5. **Create a new Pull Request**.

## License

This project is licensed under the MIT License.

---

Feel free to update the `README.md` with any additional information or changes to the project structure as the project evolves.