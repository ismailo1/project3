# Import the dependencies.
from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
# Python SQL toolkit
from sqlalchemy import create_engine, text, inspect
# Import for creating a new database
# Note: make sure to install sqlalchemy_utils and psycopg2
# Run in terminal: 
# > pip install sqlalchemy_utils
# > pip insall psycopg2
from sqlalchemy_utils import database_exists, create_database

#################################################
# General variables

# Column names
title_column = 'Job Title'
employment_type_column = 'Employment Type'
expertise_column = 'Expertise Level'
country_column = 'Company Location'
salary_column = 'Salary in USD'
size_column = 'Company Size'
year_column = 'Year'


# function to return result dictionary, given a query string and a connection object
def dict_from_query(query_string, conn_object):
    # Instead of using:
    # data = conn.execute(text(query)).all()
    # Read query directly into pandas df
    df = pd.read_sql(query_string, conn_object)
    print(f'Total records retrieved from salaries table: {len(df)}')
    # Df to list of dictionaries
    data_list = df.to_dict(orient='records')
    # Create empty lists to add data
    job_titles = []
    countries = []
    expertise_levels = []
    # Loop through query results and put data values into a list
    for row in data_list:
        row_dict = {}
        for column in columns:
            row_dict[column] = row[column]
        job_titles.append(row_dict['Job Title'])
        countries.append(row_dict['Company Location'])
        expertise_levels.append(row_dict['Expertise Level'])
    countries = list(set(countries))
    job_titles = list(set(job_titles))
    expertise_levels = list(set(expertise_levels))
    result_dictionary = {
        'Company Location': countries,
        'Job Title': job_titles,
        'Expertise Level': expertise_levels,
        'Data': data_list
    }
    return result_dictionary

# function to return top 10 mean salaries given a query, conn and grouping column
def dict_from_query_top10(query_string, conn_object, group_by_column):
    # Read query directly into pandas df
    df = pd.read_sql(query_string, conn_object)
    print(f'Total records retrieved from salaries table: {len(df)}')
    print(f'Grouping by column: {group_by_column}')

    df = (df
        .groupby(group_by_column)
        .agg(
            by_mean_salary = (salary_column, 'mean'),
            by_max_salary = (salary_column, 'max'),
            by_min_salary = (salary_column, 'min'),
            by_median_salary = (salary_column, lambda x: np.median(x))
        )
    )
    result = {}
    for col_name in df:
        col_top10 = df[col_name].sort_values().head(10)
        result[col_name] = col_top10.to_dict()
    return result

#################################################
# Database Setup
#################################################
# Create engine to the database path
owner_username = 'postgres'
password = 'postgres'
host_name_address = 'localhost'
db_name = 'datascience'

engine = create_engine(f"postgresql://{owner_username}:{password}@{host_name_address}/{db_name}")
conn = engine.connect()

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
        <li><strong>/api/v1.0/&lt;column_name&gt;/&lt;value&gt;</strong>: returns data filtered using the specified column/value pair. (e.g. /api/v1.0/Company Location;/Canada will return all positions where the company is located in Canada)</li>
    </ul>

    '''


# Define what to do when a user hits the /api/v1.0/salaries route
@app.route("/api/v1.0/salaries")
def salaries():
    print("Server received request for 'salaries' page...")
    # Query to find salaries data
    query = text(f'SELECT * FROM "salaries"')
    result = dict_from_query(query, conn)
    return jsonify(result)

# Define what to do when a user hits the /api/v1.0/<column_name>/<value> route
@app.route("/api/v1.0/<column_name>/<value>")
def salaries_filter(column_name, value):
    print(f"Server received request for data page filtered by {column_name}: {value}...")
    # Query to find salaries data
    query = text(f'SELECT * FROM "salaries" WHERE "{column_name}" = ' + f"'{value}'")
    result = dict_from_query(query, conn)
    return jsonify(result)

# 3) country filter -> mean of salary by job title -> return top 10 values and job titles

# Define what to do when a user hits the /api/v1.0/top10_titles_by_country/<country_name> route
@app.route("/api/v1.0/top10_titles_by_country/<country_name>")
def salaries_by_country(country_name):
    print(f"Server received request for top 10 payed job titles in {country_name}...")
    # Query to find salaries data
    query = f'SELECT * FROM "salaries" WHERE "{country_column}" = ' + f"'{country_name}'"
    result = dict_from_query_top10(query, conn, 'Job Title')
    return jsonify(result)




# 4) job title filter -> mean salary by country -> return top 10 values and countries
# 5) job title filter -> mean salary by expertise -> % change
# 6) mean salary by job title and expertise grouping -> return together with individual data points

if __name__ == "__main__":
    app.run(debug=True)
