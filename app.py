# Import the dependencies.
from flask import Flask, jsonify, render_template
import pandas as pd
# Python SQL toolkit
from sqlalchemy import create_engine, text, inspect
# Import for creating a new database
# Note: make sure to install sqlalchemy_utils and psycopg2
# Run in terminal: 
# > pip install sqlalchemy_utils
# > pip insall psycopg2
from sqlalchemy_utils import database_exists, create_database

#################################################
# Database Setup
#################################################
# Create engine to the database path
owner_username = 'postgres'
password = 'postgres'
host_name_address = 'localhost'
db_name = 'datascience'

engine = create_engine(f"postgresql://{owner_username}:{password}@{host_name_address}/{db_name}")

# Create database if it does not exist already, and add data
if not database_exists(engine.url):
    print('Creating database...')
    create_database(engine.url)
    # Read data
    salaries = pd.read_csv("../Resources/salaries.csv")
    print(f'{len(salaries)} rows read from salaries.csv')
    # Add data to sql database
    salaries.to_sql('salaries', engine, if_exists='replace', index=False)

if database_exists(engine.url):
    print('Database connection was successful.')
else:
    print('Something went wrong.')

# Create the inspector and connect it to the engine
inspector = inspect(engine)
# Using the inspector to get the columns within the 'salaries' table
inspected_columns = inspector.get_columns('salaries')
# Create list of columns
columns = [column['name'] for column in inspected_columns]
print('Column names fetched from salaries table.')
print(columns)
#################################################
# Flask Setup
#################################################
# Create app, passing __name__
app = Flask(__name__)

#################################################
# Flask Routes
#################################################
# Define what to do when a user hits the index route
@app.route("/")
def home():
    # html showing available routes
    print("Server received request for 'Home' page...")
    return render_template('index.html')

# API home route, listing data routes
@app.route("/api/v1.0/")
def api_routes():
    return '''
    <h2>Welcome to the Data Science Salaries API!</h2>

    <p>Available static route:</p>
    <ul>
        <li><strong>/api/v1.0/salaries</strong>: returns all data from the salaries table.</li>
    </ul>
    <p>Available dynamic route:</p>
    <ul>
        <li><strong>/api/v1.0/salaries/&lt;country&gt;</strong>: returns all data, filtered by the specified country.</li>
    </ul>

    '''


# Define what to do when a user hits the /api/v1.0/salaries route
@app.route("/api/v1.0/salaries")
def salaries():
    print("Server received request for 'salaries' page...")
    # Query to find salaries data
    query = text(f'SELECT * FROM "salaries"')
    data = engine.execute(query).all()
    print(f'Total records retrieved from salaries table: {len(data)}')
    # Create an empty list to add data
    data_list = []
    # Loop through query results and put data values into a list
    for row in data:
        row_dict = {}
        for idx, column in enumerate(columns):
            row_dict[column] = row[idx]

        data_list.append(row_dict)
    return jsonify(data_list)

# Define what to do when a user hits the /api/v1.0/salaries route
@app.route("/api/v1.0/salaries/<country>")
def salaries_by_country(country):
    print(f"Server received request for 'salaries' page filtered by country: {country}...")
    # Query to find salaries data
    query = text('SELECT * FROM "salaries" WHERE "Company Location" = ' + f"'{country}'")
    data = engine.execute(query).all()
    print(f'Total records retrieved from salaries table: {len(data)}')
    # Create an empty list to add data
    data_list = []
    # Loop through query results and put data values into a list
    for row in data:
        row_dict = {}
        for idx, column in enumerate(columns):
            row_dict[column] = row[idx]

        data_list.append(row_dict)
    return jsonify(data_list)

if __name__ == "__main__":
    app.run(debug=True)
