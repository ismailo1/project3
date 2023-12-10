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
experience_column = 'Expertise Level'
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
    experience_levels = []
    # Loop through query results and put data values into a list
    for row in data_list:
        row_dict = {}
        for column in columns:
            row_dict[column] = row[column]
        job_titles.append(row_dict[title_column])
        countries.append(row_dict[country_column])
        experience_levels.append(row_dict[experience_column])
    countries = list(set(countries))
    job_titles = list(set(job_titles))
    experience_levels = list(set(experience_levels))
    result_dictionary = {
        country_column: countries,
        title_column: job_titles,
        experience_column: experience_levels,
        'Data': data_list
    }
    return result_dictionary

# function to return top 10 mean salaries given a query, conn and grouping column
def agg_dict_from_query(query_string, conn_object, group_by_column, top10=True):
    # Read query directly into pandas df
    df = pd.read_sql(query_string, conn_object)
    print(f'Total records retrieved from salaries table: {len(df)}')
    print(f'Grouping by column: {group_by_column}')

    df = (df
        .groupby(group_by_column)
        .agg(
            mean_salary = (salary_column, 'mean'),
            max_salary = (salary_column, 'max'),
            min_salary = (salary_column, 'min'),
            median_salary = (salary_column, lambda x: np.median(x))
        )
    )
    result_dictionary = {}
    for col_name in df:
        col_ordered = (df[col_name]
            .rename('salary')
            .sort_values(ascending=False)
            .reset_index(drop=False)
        )
        # Whether to get top10 only
        if top10:
            col_ordered = col_ordered.head(10)
        col_ordered.index += 1 
        # organize result in dictionary of dictionaries
        result_dictionary[col_name] = col_ordered.to_dict(orient='index')
        for record in result_dictionary[col_name]:
            record_data = result_dictionary[col_name][record]
            result_dictionary[col_name][record] = [
                record_data[group_by_column],
                record_data['salary']
            ]
    return result_dictionary

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
        <li><strong>/api/v1.0/filter/&lt;column_name&gt;/&lt;value&gt;</strong>: returns data filtered using the specified column/value pair. (e.g. <i>/api/v1.0/Company Location/Canada</i> will return all positions where the company is located in Canada)</li>
        <li><strong>/api/v1.0/country/&lt;country_name&gt;/top10_job_titles</strong>: returns data filtered by the indicated country_name, from the Company Location column. It returns the top 10 job titles by several different summary statistics of the salary in USD (e.g. <i>/api/v1.0/country/Canada/top10_job_titles</i> will return the top 10 job titles by salary where the company is based in Canada, as a list of dictionaries, one dictionary for each summary statistic: mean, max, min and median)</li>
        <li><strong>/api/v1.0/top10_countries_by_title/&lt;title_name&gt;</strong>: returns data filtered by the indicated title_name. It returns the top 10 countries by several different summary statistics of the salary in USD (e.g. <i>/api/v1.0/top10_countries_by_title/Data Analyst</i> will return the top 10 countries based on salary of the Data Analyst job title, as a list of dictionaries, one dictionary for each summary statistic: mean, max, min and median)</li>
        <li><strong>/api/v1.0/job_title/&lt;title_name&gt;/experience_levels</strong>: returns data filtered by the indicated title_name and the several different summary statistics of the salary in USD for each experitise level (e.g. <i>/api/v1.0/job_title/Data Analyst/experience_levels</i> will return the summary statisting for the salary of different experience levels for the Data Analyst job title, as a list of dictionaries, one dictionary for each summary statistic: mean, max, min and median)</li>
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

# Define what to do when a user hits the /api/v1.0/filter/<column_name>/<value> route
@app.route("/api/v1.0/filter/<column_name>/<value>")
def salaries_filter(column_name, value):
    print(f"Server received request for data page filtered by {column_name}: {value}...")
    # Query to find salaries data
    query = text(f'SELECT * FROM "salaries" WHERE "{column_name}" = ' + f"'{value}'")
    result = dict_from_query(query, conn)
    return jsonify(result)

# Define what to do when a user hits the /api/v1.0/country/<country_name>/top10_job_titles route
@app.route("/api/v1.0/country/<country_name>/top10_job_titles")
def salaries_by_country_top10_titles(country_name):
    print(f"Server received request for top 10 payed job titles in {country_name}...")
    # Query to find salaries data
    query = f'SELECT * FROM "salaries" WHERE "{country_column}" = ' + f"'{country_name}'"
    result = agg_dict_from_query(query, conn, title_column)
    return jsonify(result)

# Define what to do when a user hits the /api/v1.0/country/<country_name>/all_job_titles route
@app.route("/api/v1.0/country/<country_name>/all_job_titles")
def salaries_by_country_all_titles(country_name):
    print(f"Server received requestrequest for summary of salary by job title in {country_name}...")
    # Query to find salaries data
    query = f'SELECT * FROM "salaries" WHERE "{country_column}" = ' + f"'{country_name}'"
    result = agg_dict_from_query(query, conn, title_column, False)
    return jsonify(result)


# Define what to do when a user hits the /api/v1.0/job_title/<job_title>/top10_countries route
@app.route("/api/v1.0/job_title/<job_title>/top10_countries")
def salaries_by_title_top10_countries(job_title_name):
    print(f"Server received request for top 10 payed countries for job title: {job_title_name}...")
    # Query to find salaries data
    query = f'SELECT * FROM "salaries" WHERE "{title_column}" = ' + f"'{job_title_name}'"
    result = agg_dict_from_query(query, conn, country_column)
    return jsonify(result)

# Define what to do when a user hits the /api/v1.0/job_title/<job_title>/all_countries route
@app.route("/api/v1.0/job_title/<job_title>/all_countries")
def salaries_by_title_all_countries(job_title_name):
    print(f"Server received request for summary of salary by country for job title: {job_title_name}...")
    # Query to find salaries data
    query = f'SELECT * FROM "salaries" WHERE "{title_column}" = ' + f"'{job_title_name}'"
    result = agg_dict_from_query(query, conn, country_column, False)
    return jsonify(result)

# Define what to do when a user hits the /api/v1.0/job_title/<job_title>/experience_levels route
@app.route("/api/v1.0/job_title/<job_title>/experience_levels")
def salaries_by_title_experience_levels(job_title_name):
    print(f"Server received request for salary summary by experience level for job title: {job_title_name}...")
    # Query to find salaries data
    query = f'SELECT * FROM "salaries" WHERE "{title_column}" = ' + f"'{job_title_name}'"
    result = agg_dict_from_query(query, conn, experience_column, False)
    return jsonify(result)

# Define what to do when a user hits the /api/v1.0/experience_level/<experience_level_name>/top10_countries route
@app.route("/api/v1.0/experience_level/<experience_level_name>/top10_countries")
def salaries_by_experience_top10_countries(experience_level_name):
    print(f"Server received request for top 10 payed countries for experience level: {experience_level_name}...")
    # Query to find salaries data
    query = f'SELECT * FROM "salaries" WHERE "{experience_column}" = ' + f"'{experience_level_name}'"
    result = agg_dict_from_query(query, conn, country_column)
    return jsonify(result)

# Define what to do when a user hits the /api/v1.0/experience_level/<experience_level_name>/all_countries route
@app.route("/api/v1.0/experience_level/<experience_level_name>/all_countries")
def salaries_by_experience_all_countries(experience_level_name):
    print(f"Server received request for summary of salary by country for experience level: {experience_level_name}...")
    # Query to find salaries data
    query = f'SELECT * FROM "salaries" WHERE "{experience_column}" = ' + f"'{experience_level_name}'"
    result = agg_dict_from_query(query, conn, country_column, False)
    return jsonify(result)



if __name__ == "__main__":
    app.run(debug=True)
