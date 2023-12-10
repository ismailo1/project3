# Salaries in Data World

Project 3 - Group 1 by Ismail Omer, Yargi Kilinc, Archit Hallan, Tania Barrera

We are delighted to present Project 3, a comprehensive exploration tailored for employers, job seekers in the data realm, individuals contemplating joining a bootcamp, and esteemed global HR companies.

Our sophisticated visuals provide profound insights:

**By Selecting COUNTRY from Dropdown1**

1.	a horizontal bar chart that displays the top 10 highest-paying job titles 

> **API route:** `/api/v1.0/country/<country_name>/top10_job_titles`
> 
> **API route if you want all job titles instead of only top10:** `/api/v1.0/country/<country_name>/all_job_titles`

2.	an interactive Map displaying total number of all job titles with a popup marker

> **API route:** `/api/v1.0/country/<country_name>/job_title_counts`

**By Selecting JOB TITLE from Dropdown2**

3.	a bar chart that displays the top 10 highest paying countries

> **API route:** `/api/v1.0/job_title/<job_title>/top10_countries`

4.	an interactive bubble map that displays the top 10 highest paying countries,

> **API route if you want all countries instead of only top10:** `/api/v1.0/job_title/<job_title>/all_countries`

**By Selecting EXPERIENCE LEVEL from Dropdown3**

5.	a bar chart that displays Top10 highest paying countries for that experience level 

> **API route:** `/api/v1.0/experience_level/<experience_level_name>/top10_countries`

6.	an interactive bubble map that displays the salaries for the experience level selected for all countries 

> **API route:** `/api/v1.0/experience_level/<experience_level_name>/all_countries`

![image](https://github.com/ismailo1/project3/assets/142269763/c0015b2a-1c6d-4eb8-948e-b20085f859a7)


This initiative serves as your compass for well-informed decisions in hiring, job seeking, bootcamp considerations, and global HR strategies.

![image](https://github.com/ismailo1/project3/assets/142269763/f32a5946-e8c9-4451-aab3-e94490ec2b0d)


## How to

To visualize the dashboard, clone the repository into your machine and run the app.py flask application using `python app.py` from Terminal. The Home page (i.e. `/`) will display the dashboard.

Additionaly, you can access the API via this same application. For route explanation go to the `/api/v1.0/` page or see API routes below.

### Python dependencies

You will need to have installed the following python packages:

- `flask`

- `pandas`

- `numpy`

- `sqlalchemy`

- `sqlalchemy_utils`

- `psycopg2`

### API routes

Our API has a static route that returns all the individual data points, along with the distinct values present in the dataset for the `Company Location`, `Job Title`, `Expertise Level` columns.

To access this route, follow this relative route after stating your local server: `/api/v1.0/salaries`

The returned data is in json format and follows this structure:

```json

{
    "Company Location": [
        "Canada",
        "Germany",
        "India"
    ],
    "Data": [{
            "Company Location": "Canada",
            "Company Size": "Large",
            "Employment Type": "Contract",
            "Expertise Level": "Junior",
            "Job Title": "Staff Data Analyst",
            "Salary in USD": 44753,
            "Year": 2020
        },
        {
            "Company Location": "Germany",
            "Company Size": "Medium",
            "Employment Type": "Full-Time",
            "Expertise Level": "Junior",
            "Job Title": "AI Engineer",
            "Salary in USD": 35000,
            "Year": 2023
        },
        {
            "Company Location": "India",
            "Company Size": "Large",
            "Employment Type": "Full-Time",
            "Expertise Level": "Expert",
            "Job Title": "Data Science Manager",
            "Salary in USD": 94665,
            "Year": 2021
        }
    ],
    "Expertise Level": [
        "Expert",
        "Junior"
    ],
    "Job Title": [
        "Staff Data Analyst",
        "AI Engineer",
        "Data Science Manager"
    ]
}

```



---

## References

Head photo rights belongs to https://www.digitalvidya.com/blog/data-science-jobs/
