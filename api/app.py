# Import the dependencies.
from flask import Flask, jsonify
import pandas as pd
# Python SQL toolkit and Object Relational Mapper
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
# Import for creating a new database
# Note: make sure to install sqlalchemy_utils and psycopg2
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
    create_database(engine.url)

if database_exists(engine.url):
    print('Database connection was successful!')
else:
    print('Something went wrong.')

# Read data
salaries= pd.read_csv("../Resources/salaries.csv")
# Add data to sql database
salaries.to_sql('salaries', engine, if_exists='replace', index=False)

# Reflect an existing database into a new model
Base = automap_base()

# Reflect the tables
Base.prepare(autoload_with=engine)

# Save references to each table
Salaries = Base.classes.salaries

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
def tobs():
    print("Server received request for 'salaries' page...")
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Query to find salaries data
    data_query = (session
                .query(Salaries)
                .all()
                )
    # Loop through query results and put data values into a list
    data_list = [row[0] for row in data_query]
    # Close Session
    session.close()
    return jsonify(data_list)

if __name__ == "__main__":
    app.run(debug=True)
