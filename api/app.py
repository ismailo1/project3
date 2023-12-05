# Import the dependencies.
from flask import Flask, jsonify
import pandas as pd
# Python SQL toolkit and Object Relational Mapper
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text
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

if not database_exists(engine.url):
    print('Creating database...')
    create_database(engine.url)
    # Read data
    salaries = pd.read_csv("../Resources/salaries.csv")
    print('salaries.csv read')
    # Add data to sql database
    rows_added = salaries.to_sql('salaries', engine, if_exists='replace', index=False)

    print(f"{rows_added} rows were added successfully to salaries table.")

if database_exists(engine.url):
    print('Database connection successful!')
else:
    print('Something went wrong.')



# create list of columns
columns = [
    'Job Title',
    'Employment Type',
    'Expertise Level',
    'Company Location',
    'Salary in USD',
    'Company Size',
    'Year'
]
# Reflect an existing database into a new model
# Base = automap_base()

# # Reflect the tables
# Base.prepare(autoload_with=engine)

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
    return '''
    <h2>Welcome to the Salaries API!</h2>

    <p>Available static route:</p>
    <ul>
        <li>/api/v1.0/salaries</li>
    </ul>

    '''

# Define what to do when a user hits the /api/v1.0/salaries route
@app.route("/api/v1.0/salaries")
def salaries():
    print("Server received request for 'salaries' page...")
    # Create our session (link) from Python to the DB
    # session = Session(engine)
    # Query to find salaries data
    # data_query = (session
    #             .query(Salaries)
    #             .all()
    #             )
    query = text(f'SELECT * FROM "salaries"')
    data = engine.execute(query).all()
    print(f'Total records retrieved from salaries table: {len(data)}')
    # empty list to add data
    data_list = []
    # Loop through query results and put data values into a list
    for row in data:
        row_dict = {}
        for idx, column in enumerate(columns):
            row_dict[column] = row[idx]

        data_list.append(row_dict)
    # Close Session
    # session.close()
    return jsonify(data_list)

if __name__ == "__main__":
    app.run(debug=True)
