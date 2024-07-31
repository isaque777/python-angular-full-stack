import pandas as pd
from sklearn.preprocessing import MinMaxScaler


def read_csv(file_path):
    """Read the CSV file and return a pandas DataFrame."""
    return pd.read_csv(file_path)


def parse_date_columns(df):
    """Parse the 'StartDate' and 'EndDate' columns as datetime."""
    df["StartDate"] = pd.to_datetime(df["StartDate"])
    df["EndDate"] = pd.to_datetime(df["EndDate"])
    return df


def normalize_price(df):
    """Normalize the 'Price' column using MinMaxScaler."""
    scaler = MinMaxScaler()
    df["Price"] = scaler.fit_transform(df[["Price"]])
    return df


def convert_text_columns(df):
    """Convert specified text columns to categorical codes."""
    text_columns = [
        "University",
        "City",
        "Country",
        "CourseName",
        "CourseDescription",
        "Currency",
    ]
    # Dictionary to store the categories for each column
    categories = {
        "University": {},
        "City": {},
        "Country": {},
        "CourseName": {},
        "CourseDescription": {},
        "Currency": {},
    }

    for column in text_columns:
        # Convert to categorical and get the categories
        df[column] = df[column].astype("category")
        # categories[column] = dict(enumerate(df[column].cat.categories))
        # Convert to codes
        # df[column] = df[column].cat.codes
        df[column] = df[column].cat.categories

    return df, categories


def display_dataframe(df):
    """Print the processed DataFrame."""
    print(df)


def data_factory():
    # Step 1: Read the CSV file
    file_path = "static/UniversitySchema.csv"
    df = read_csv(file_path)

    # Step 2: Parse date columns
    df = parse_date_columns(df)

    # Step 3: Normalize the 'Price' column
    df = normalize_price(df)

    # Display the processed DataFrame
    display_dataframe(df)

    return df
